import type { AnaliseChessApi } from "@/src/model/Analise";

export type Classificacao =
	| "melhor"
	| "boa"
	| "imprecisao"
	| "erro"
	| "capivarada";

export type AvaliacaoLance = {
	classificacao: Classificacao;
	perda: number;
	melhorLanceSan?: string;
	melhorLanceUci?: string;
};

const LIMITE_BOA = 0.3;
const LIMITE_IMPRECISAO = 0.7;
const LIMITE_ERRO = 1.5;

function evalNormalizado(av: number, mate: number | undefined): number {
	if (mate !== undefined && mate !== 0) {
		return mate > 0 ? 100 : -100;
	}
	return av;
}

export function classificarLance(
	analiseAntes: AnaliseChessApi,
	analiseDepois: AnaliseChessApi,
	lanceUci: string,
	brancasJogaram: boolean,
	ehMateAposLance = false,
): AvaliacaoLance {
	if (ehMateAposLance) {
		return {
			classificacao: "melhor",
			perda: 0,
			melhorLanceSan: analiseAntes.melhorLanceSan,
			melhorLanceUci: analiseAntes.melhorLance,
		};
	}

	const sinal = brancasJogaram ? 1 : -1;
	const antes = evalNormalizado(analiseAntes.avaliacao, analiseAntes.mate);
	const depois = evalNormalizado(analiseDepois.avaliacao, analiseDepois.mate);
	const perda = sinal * (antes - depois);

	const ehMelhor =
		!!analiseAntes.melhorLance &&
		analiseAntes.melhorLance.toLowerCase() === lanceUci.toLowerCase();

	let classificacao: Classificacao;
	if (ehMelhor) classificacao = "melhor";
	else if (perda < LIMITE_BOA) classificacao = "boa";
	else if (perda < LIMITE_IMPRECISAO) classificacao = "imprecisao";
	else if (perda < LIMITE_ERRO) classificacao = "erro";
	else classificacao = "capivarada";

	return {
		classificacao,
		perda,
		melhorLanceSan: analiseAntes.melhorLanceSan,
		melhorLanceUci: analiseAntes.melhorLance,
	};
}

export function rotuloClassificacao(c: Classificacao): string {
	switch (c) {
		case "melhor":
			return "Melhor lance";
		case "boa":
			return "Boa";
		case "imprecisao":
			return "Imprecisão";
		case "erro":
			return "Erro";
		case "capivarada":
			return "Capivarada";
	}
}

export function corClassificacao(c: Classificacao): string {
	switch (c) {
		case "melhor":
			return "#4ade80";
		case "boa":
			return "#86efac";
		case "imprecisao":
			return "#facc15";
		case "erro":
			return "#fb923c";
		case "capivarada":
			return "#f87171";
	}
}
