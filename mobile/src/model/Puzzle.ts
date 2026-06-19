export interface PuzzleProximo {
	id: string;
	fen: string;
	lancesOponente: string[];
	lancesJogadorEsperados: string[];
	rating: number;
	temas: string[];
}

export interface ResultadoPuzzle {
	resolveu: boolean;
	resolveuPrimeira: boolean;
	ratingAntigo: number;
	ratingNovo: number;
	delta: number;
	rd: number;
	lancesSolucao: string[];
}

export interface TentativaPuzzle {
	puzzleId: string;
	resolveuPrimeira: boolean;
	tentativas: number;
	deltaRating: number;
	ratingApos: number;
	criadoEm: string;
}

export interface HistoricoPuzzles {
	rating: number;
	rd: number;
	volatilidade: number;
	tentativas: TentativaPuzzle[];
}
