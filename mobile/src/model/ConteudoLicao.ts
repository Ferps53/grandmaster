import type { Square } from "chess.js";

export type DestaqueCasa = {
	square: Square;
	color: string;
};

export type PassoLicao = {
	instrucao: string;
	dica?: string;
	/** FEN da posição que o jogador deve jogar */
	fen: string;
	movimentoEsperado: { from: Square; to: Square };
	/** Casas a destacar antes do movimento (para guiar o usuário) */
	destaques?: DestaqueCasa[];
	/** Movimento automático do computador após o movimento correto do usuário */
	respostaComputador?: { from: Square; to: Square };
};

export type ConteudoLicao = {
	id: string;
	titulo: string;
	descricao: string;
	passos: PassoLicao[];
};
