import type { Request, Response } from "express";
import { puzzlesDb as db } from "./puzzles.db";
import { calcular } from "./puzzles.glicko2";

const HISTORICO_LIMITE_PADRAO = 10;
const HISTORICO_LIMITE_MAXIMO = 50;

function validarLancesJogados(valor: unknown): string[] | null {
	if (!Array.isArray(valor)) {
		return null;
	}
	if (valor.length === 0) {
		return null;
	}
	const lances: string[] = [];
	for (const item of valor) {
		if (typeof item !== "string" || item.length < 4 || item.length > 5) {
			return null;
		}
		lances.push(item);
	}
	return lances;
}

/**
 * Formato Lichess: índice 0 é lance de setup do oponente (auto-tocado pra chegar
 * na posição do puzzle). Depois alterna: ímpares = jogador, pares (>=2) = resposta
 * do oponente.
 */
function lancesDoJogador(lancesSolucao: string[]): string[] {
	return lancesSolucao.filter((_, idx) => idx % 2 === 1);
}

function lancesDoOponente(lancesSolucao: string[]): string[] {
	return lancesSolucao.filter((_, idx) => idx % 2 === 0);
}

export const puzzlesController = {
	async proximo(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}

			const rating = await db.obterRatingUsuario(req.usuario.id);
			const puzzle = await db.obterPuzzleAleatorio(
				req.usuario.id,
				rating.rating,
			);
			if (!puzzle) {
				return res
					.status(404)
					.json({ mensagem: "Nenhum puzzle disponível no momento" });
			}

			const lancesOponente = lancesDoOponente(puzzle.lancesSolucao);
			const lancesJogadorEsperados = lancesDoJogador(puzzle.lancesSolucao);
			return res.status(200).json({
				id: puzzle.id,
				fen: puzzle.fen,
				lancesOponente,
				lancesJogadorEsperados,
				rating: puzzle.rating,
				temas: puzzle.temas,
			});
		} catch (erro) {
			console.error("Erro ao buscar próximo puzzle:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async submeterResultado(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}

			const lancesJogados = validarLancesJogados(req.body?.lancesJogados);
			if (!lancesJogados) {
				return res.status(400).json({
					mensagem: "Campo 'lancesJogados' inválido",
					campo: "lancesJogados",
				});
			}

			const tentativas = req.body?.tentativas;
			if (
				typeof tentativas !== "number" ||
				!Number.isInteger(tentativas) ||
				tentativas < 1
			) {
				return res.status(400).json({
					mensagem: "Campo 'tentativas' deve ser inteiro >= 1",
					campo: "tentativas",
				});
			}

			const puzzle = await db.obterPuzzle(req.params.id);
			if (!puzzle) {
				return res.status(404).json({ mensagem: "Puzzle não encontrado" });
			}

			const jaTentou = await db.usuarioJaTentou(req.usuario.id, puzzle.id);
			if (jaTentou) {
				return res.status(409).json({
					mensagem: "Puzzle já foi tentado por este usuário",
				});
			}

			const lancesEsperados = lancesDoJogador(puzzle.lancesSolucao);
			const resolveu =
				lancesJogados.length === lancesEsperados.length &&
				lancesJogados.every((lance, idx) => lance === lancesEsperados[idx]);
			const resolveuPrimeira = resolveu && tentativas === 1;

			const ratingAtual = await db.obterRatingUsuario(req.usuario.id);
			const novoRating = calcular(ratingAtual, [
				{ rating: puzzle.rating, rd: 50, score: resolveuPrimeira ? 1 : 0 },
			]);

			await db.registrarTentativa({
				usuarioId: req.usuario.id,
				puzzleId: puzzle.id,
				resolveuPrimeira,
				tentativas,
				ratingAntigo: ratingAtual.rating,
				ratingNovo: novoRating.rating,
				rdNovo: novoRating.rd,
				volatilidadeNova: novoRating.volatilidade,
			});

			return res.status(200).json({
				resolveu,
				resolveuPrimeira,
				ratingAntigo: ratingAtual.rating,
				ratingNovo: novoRating.rating,
				delta: novoRating.rating - ratingAtual.rating,
				rd: novoRating.rd,
				lancesSolucao: puzzle.lancesSolucao,
			});
		} catch (erro) {
			console.error("Erro ao submeter resultado:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async historico(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}

			const limiteParam = Number.parseInt(String(req.query.limite ?? ""), 10);
			const limite =
				Number.isInteger(limiteParam) && limiteParam > 0
					? Math.min(limiteParam, HISTORICO_LIMITE_MAXIMO)
					: HISTORICO_LIMITE_PADRAO;

			const historico = await db.obterHistorico(req.usuario.id, limite);
			return res.status(200).json(historico);
		} catch (erro) {
			console.error("Erro ao buscar histórico:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},
};
