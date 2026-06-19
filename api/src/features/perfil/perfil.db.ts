import { sql } from "bun";

export interface DadosPerfil {
	id: string;
	nome: string;
	email: string;
	criadoEm: Date;
	xp: number;
	rating: number;
	rd: number;
	volatilidade: number;
	tentativasRecentes: TentativaRecente[];
}

export interface TentativaRecente {
	puzzleId: string;
	resolveuPrimeira: boolean;
	tentativas: number;
	deltaRating: number;
	ratingApos: number;
	criadoEm: Date;
}

interface UsuarioRow {
	id: string;
	nome: string;
	email: string;
	criado_em: Date;
	xp: number;
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

export const perfilDb = {
	async obterPerfil(
		usuarioId: string,
		limiteTentativas: number,
	): Promise<DadosPerfil | undefined> {
		const usuarios = await sql<UsuarioRow[]>`
      SELECT id, nome, email, criado_em, xp, rating, rd, volatilidade
      FROM usuarios
      WHERE id = ${usuarioId}
    `;
		const usuario = usuarios[0];
		if (!usuario) {
			return undefined;
		}

		const tentativas = await sql<TentativaRow[]>`
      SELECT puzzle_id, resolveu_primeira, tentativas, delta_rating, rating_apos, criado_em
      FROM puzzle_tentativas
      WHERE usuario_id = ${usuarioId}
      ORDER BY criado_em DESC
      LIMIT ${limiteTentativas}
    `;

		return {
			id: usuario.id,
			nome: usuario.nome,
			email: usuario.email,
			criadoEm: usuario.criado_em,
			xp: usuario.xp,
			rating: usuario.rating,
			rd: usuario.rd,
			volatilidade: usuario.volatilidade,
			tentativasRecentes: tentativas.map((t) => ({
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
