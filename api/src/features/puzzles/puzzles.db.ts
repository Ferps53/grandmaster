import { sql } from "bun";
import type { RatingGlicko } from "./puzzles.glicko2";

const JANELA_RATING = 200;
const JANELA_RATING_FALLBACK = 500;

export interface Puzzle {
	id: string;
	fen: string;
	lancesSolucao: string[];
	rating: number;
	popularidade: number;
	temas: string[];
}

export interface TentativaHistorico {
	puzzleId: string;
	resolveuPrimeira: boolean;
	tentativas: number;
	deltaRating: number;
	ratingApos: number;
	criadoEm: Date;
}

export interface HistoricoPerfil {
	rating: number;
	rd: number;
	volatilidade: number;
	tentativas: TentativaHistorico[];
}

interface PuzzleRow {
	id: string;
	fen: string;
	lances_solucao: string[];
	rating: number;
	popularidade: number;
	temas: string[];
}

interface RatingUsuarioRow {
	rating: number;
	rd: number;
	volatilidade: number;
}

interface TentativaRow {
	puzzle_id: string;
	resolveu_primeira: boolean;
	tentativas: number;
	delta_rating: number;
	rating_apos: number;
	criado_em: Date;
}

function linhaParaPuzzle(linha: PuzzleRow): Puzzle {
	return {
		id: linha.id,
		fen: linha.fen,
		lancesSolucao: linha.lances_solucao,
		rating: linha.rating,
		popularidade: linha.popularidade,
		temas: linha.temas,
	};
}

export const puzzlesDb = {
	async obterRatingUsuario(usuarioId: string): Promise<RatingGlicko> {
		const linhas = await sql<RatingUsuarioRow[]>`
      SELECT rating, rd, volatilidade
      FROM usuarios
      WHERE id = ${usuarioId}
    `;
		const linha = linhas[0];
		if (!linha) {
			throw new Error("Usuário não encontrado");
		}
		return {
			rating: linha.rating,
			rd: linha.rd,
			volatilidade: linha.volatilidade,
		};
	},

	async obterPuzzle(id: string): Promise<Puzzle | undefined> {
		const linhas = await sql<PuzzleRow[]>`
      SELECT id, fen, lances_solucao, rating, popularidade, temas
      FROM puzzles
      WHERE id = ${id}
    `;
		if (!linhas[0]) {
			return undefined;
		}
		return linhaParaPuzzle(linhas[0]);
	},

	async obterPuzzleAleatorio(
		usuarioId: string,
		ratingAlvo: number,
	): Promise<Puzzle | undefined> {
		const candidatos = await sql<PuzzleRow[]>`
      SELECT p.id, p.fen, p.lances_solucao, p.rating, p.popularidade, p.temas
      FROM puzzles p
      WHERE p.rating BETWEEN ${ratingAlvo - JANELA_RATING} AND ${ratingAlvo + JANELA_RATING}
        AND NOT EXISTS (
          SELECT 1 FROM puzzle_tentativas t
          WHERE t.puzzle_id = p.id AND t.usuario_id = ${usuarioId}
        )
      ORDER BY random()
      LIMIT 1
    `;
		if (candidatos[0]) {
			return linhaParaPuzzle(candidatos[0]);
		}

		const fallback = await sql<PuzzleRow[]>`
      SELECT p.id, p.fen, p.lances_solucao, p.rating, p.popularidade, p.temas
      FROM puzzles p
      WHERE p.rating BETWEEN ${ratingAlvo - JANELA_RATING_FALLBACK} AND ${ratingAlvo + JANELA_RATING_FALLBACK}
        AND NOT EXISTS (
          SELECT 1 FROM puzzle_tentativas t
          WHERE t.puzzle_id = p.id AND t.usuario_id = ${usuarioId}
        )
      ORDER BY random()
      LIMIT 1
    `;
		if (fallback[0]) {
			return linhaParaPuzzle(fallback[0]);
		}
		return undefined;
	},

	async registrarTentativa(params: {
		usuarioId: string;
		puzzleId: string;
		resolveuPrimeira: boolean;
		tentativas: number;
		ratingAntigo: number;
		ratingNovo: number;
		rdNovo: number;
		volatilidadeNova: number;
	}): Promise<void> {
		const delta = params.ratingNovo - params.ratingAntigo;
		await sql.begin(async (tx: typeof sql) => {
			await tx`
        INSERT INTO puzzle_tentativas
          (usuario_id, puzzle_id, resolveu_primeira, tentativas, delta_rating, rating_apos)
        VALUES
          (${params.usuarioId}, ${params.puzzleId}, ${params.resolveuPrimeira},
           ${params.tentativas}, ${delta}, ${params.ratingNovo})
      `;
			await tx`
        UPDATE usuarios
        SET rating = ${params.ratingNovo},
            rd = ${params.rdNovo},
            volatilidade = ${params.volatilidadeNova},
            rating_atualizado_em = now()
        WHERE id = ${params.usuarioId}
      `;
		});
	},

	async usuarioJaTentou(usuarioId: string, puzzleId: string): Promise<boolean> {
		const linhas = await sql<{ existe: boolean }[]>`
      SELECT EXISTS(
        SELECT 1 FROM puzzle_tentativas
        WHERE usuario_id = ${usuarioId} AND puzzle_id = ${puzzleId}
      ) AS existe
    `;
		return linhas[0]?.existe ?? false;
	},

	async obterHistorico(
		usuarioId: string,
		limite: number,
	): Promise<HistoricoPerfil> {
		const ratings = await sql<RatingUsuarioRow[]>`
      SELECT rating, rd, volatilidade
      FROM usuarios
      WHERE id = ${usuarioId}
    `;
		const ratingAtual = ratings[0];
		if (!ratingAtual) {
			throw new Error("Usuário não encontrado");
		}

		const tentativas = await sql<TentativaRow[]>`
      SELECT puzzle_id, resolveu_primeira, tentativas, delta_rating, rating_apos, criado_em
      FROM puzzle_tentativas
      WHERE usuario_id = ${usuarioId}
      ORDER BY criado_em DESC
      LIMIT ${limite}
    `;

		return {
			rating: ratingAtual.rating,
			rd: ratingAtual.rd,
			volatilidade: ratingAtual.volatilidade,
			tentativas: tentativas.map((t) => ({
				puzzleId: t.puzzle_id,
				resolveuPrimeira: t.resolveu_primeira,
				tentativas: t.tentativas,
				deltaRating: t.delta_rating,
				ratingApos: t.rating_apos,
				criadoEm: t.criado_em,
			})),
		};
	},
};
