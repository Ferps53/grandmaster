/**
 * Glicko-2 (Mark Glickman, 2013).
 * Paper: http://www.glicko.net/glicko/glicko2.pdf
 *
 * Sistema de rating que mantém três valores por jogador:
 *  - rating: estimativa de força (1500 = média padrão)
 *  - desvio (RD): incerteza sobre o rating (alto = sistema não conhece bem o jogador)
 *  - volatilidade: quão errático é o desempenho do jogador
 */

/** Constante do sistema. Restringe variação de volatilidade ao longo do tempo. */
const CONSTANTE_SISTEMA = 0.5;

/** Critério de parada da iteração de Illinois pra nova volatilidade. */
const TOLERANCIA_CONVERGENCIA = 1e-6;

/** Converte rating Glicko-1 (~ELO) pra escala interna do Glicko-2. */
const FATOR_ESCALA = 173.7178;

/** Rating médio inicial usado como ponto de referência da conversão de escala. */
const RATING_MEDIO = 1500;

export interface RatingGlicko {
	rating: number;
	rd: number;
	volatilidade: number;
}

export interface ResultadoOponente {
	rating: number;
	rd: number;
	/** 1 = jogador venceu, 0 = jogador perdeu. */
	score: 0 | 1;
}

interface EscalaInterna {
	ratingEscalonado: number;
	desvioEscalonado: number;
}

/** Passa rating/RD do espaço público (Glicko-1) pro espaço interno (Glicko-2). */
function paraEscalaInterna(r: { rating: number; rd: number }): EscalaInterna {
	return {
		ratingEscalonado: (r.rating - RATING_MEDIO) / FATOR_ESCALA,
		desvioEscalonado: r.rd / FATOR_ESCALA,
	};
}

function deEscalaInterna(
	ratingEscalonado: number,
	desvioEscalonado: number,
): {
	rating: number;
	rd: number;
} {
	return {
		rating: ratingEscalonado * FATOR_ESCALA + RATING_MEDIO,
		rd: desvioEscalonado * FATOR_ESCALA,
	};
}

/**
 * Fator de atenuação — reduz o peso de um oponente conforme o desvio dele cresce
 * (oponente mais incerto influencia menos o rating do jogador).
 */
function fatorAtenuacao(desvioEscalonado: number): number {
	const numerador = 3 * desvioEscalonado * desvioEscalonado;
	return 1 / Math.sqrt(1 + numerador / (Math.PI * Math.PI));
}

/**
 * Expectativa de vitória do jogador contra um oponente,
 * dadas as posições internas dos dois ratings.
 */
function expectativaVitoria(
	ratingJogador: number,
	ratingOponente: number,
	desvioOponente: number,
): number {
	const expoente =
		-fatorAtenuacao(desvioOponente) * (ratingJogador - ratingOponente);
	return 1 / (1 + Math.exp(expoente));
}

/**
 * Itera a nova volatilidade do jogador via algoritmo de Illinois (variação do método
 * da falsa posição). Encontra a raiz da função f(x) descrita no paper, seção 5.1 passo 5.
 */
function calcularNovaVolatilidade(
	volatilidadeAtual: number,
	desvioEscalonado: number,
	varianciaEstimada: number,
	ajusteEstimado: number,
): number {
	const desvioQuadrado = desvioEscalonado * desvioEscalonado;
	const ajusteQuadrado = ajusteEstimado * ajusteEstimado;
	const logVolatilidadeAtual = Math.log(volatilidadeAtual * volatilidadeAtual);

	const funcao = (x: number): number => {
		const expX = Math.exp(x);
		const denominador = desvioQuadrado + varianciaEstimada + expX;
		const numerador =
			expX * (ajusteQuadrado - desvioQuadrado - varianciaEstimada - expX);
		return (
			numerador / (2 * denominador * denominador) -
			(x - logVolatilidadeAtual) / (CONSTANTE_SISTEMA * CONSTANTE_SISTEMA)
		);
	};

	// Limite inferior começa no log da volatilidade atual; limite superior achado
	// expandindo até f mudar de sinal.
	let limiteInferior = logVolatilidadeAtual;
	let limiteSuperior: number;
	if (ajusteQuadrado > desvioQuadrado + varianciaEstimada) {
		limiteSuperior = Math.log(
			ajusteQuadrado - desvioQuadrado - varianciaEstimada,
		);
	} else {
		let passos = 1;
		while (funcao(logVolatilidadeAtual - passos * CONSTANTE_SISTEMA) < 0) {
			passos++;
		}
		limiteSuperior = logVolatilidadeAtual - passos * CONSTANTE_SISTEMA;
	}

	let fInferior = funcao(limiteInferior);
	let fSuperior = funcao(limiteSuperior);
	while (Math.abs(limiteSuperior - limiteInferior) > TOLERANCIA_CONVERGENCIA) {
		const candidato =
			limiteInferior +
			((limiteInferior - limiteSuperior) * fInferior) / (fSuperior - fInferior);
		const fCandidato = funcao(candidato);
		if (fCandidato * fSuperior <= 0) {
			limiteInferior = limiteSuperior;
			fInferior = fSuperior;
		} else {
			fInferior = fInferior / 2;
		}
		limiteSuperior = candidato;
		fSuperior = fCandidato;
	}

	return Math.exp(limiteInferior / 2);
}

/**
 * Aplica um período de avaliação Glicko-2 ao jogador, atualizando rating, RD e volatilidade.
 *
 * Se `oponentes` está vazio, só infla o RD (o jogador "esfriou" sem partidas) — caso
 * padrão pra períodos de inatividade.
 */
export function calcular(
	jogador: RatingGlicko,
	oponentes: ResultadoOponente[],
): RatingGlicko {
	if (oponentes.length === 0) {
		const desvioAtualEscalonado = jogador.rd / FATOR_ESCALA;
		const desvioInflado = Math.sqrt(
			desvioAtualEscalonado * desvioAtualEscalonado +
				jogador.volatilidade * jogador.volatilidade,
		);
		return {
			rating: jogador.rating,
			rd: desvioInflado * FATOR_ESCALA,
			volatilidade: jogador.volatilidade,
		};
	}

	const { ratingEscalonado, desvioEscalonado } = paraEscalaInterna(jogador);

	const oponentesInternos = oponentes.map((oponente) => {
		const interno = paraEscalaInterna(oponente);
		return {
			ratingEscalonado: interno.ratingEscalonado,
			desvioEscalonado: interno.desvioEscalonado,
			score: oponente.score,
		};
	});

	// Variância estimada do rating do jogador baseada nos oponentes deste período.
	let inversoDaVariancia = 0;
	// Soma usada tanto pro ajuste estimado quanto pro deslocamento final do rating.
	let somaResiduos = 0;
	for (const oponente of oponentesInternos) {
		const atenuacao = fatorAtenuacao(oponente.desvioEscalonado);
		const expectativa = expectativaVitoria(
			ratingEscalonado,
			oponente.ratingEscalonado,
			oponente.desvioEscalonado,
		);
		inversoDaVariancia +=
			atenuacao * atenuacao * expectativa * (1 - expectativa);
		somaResiduos += atenuacao * (oponente.score - expectativa);
	}
	const varianciaEstimada = 1 / inversoDaVariancia;
	const ajusteEstimado = varianciaEstimada * somaResiduos;

	const novaVolatilidade = calcularNovaVolatilidade(
		jogador.volatilidade,
		desvioEscalonado,
		varianciaEstimada,
		ajusteEstimado,
	);

	// Pré-atualiza o desvio com a nova volatilidade, depois combina com a variância
	// estimada pra obter o desvio final.
	const desvioPreAtualizado = Math.sqrt(
		desvioEscalonado * desvioEscalonado + novaVolatilidade * novaVolatilidade,
	);
	const novoDesvioEscalonado =
		1 /
		Math.sqrt(
			1 / (desvioPreAtualizado * desvioPreAtualizado) + 1 / varianciaEstimada,
		);
	const novoRatingEscalonado =
		ratingEscalonado +
		novoDesvioEscalonado * novoDesvioEscalonado * somaResiduos;

	const { rating, rd } = deEscalaInterna(
		novoRatingEscalonado,
		novoDesvioEscalonado,
	);
	return { rating, rd, volatilidade: novaVolatilidade };
}
