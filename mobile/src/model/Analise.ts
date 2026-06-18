export type ModoAnalise = "nova" | "pgn";

export type AnaliseChessApi = {
	fen: string;
	avaliacao: number;
	melhorLance: string;
	melhorLanceSan: string;
	profundidade: number;
	mate?: number;
	chanceVitoria?: number;
	texto?: string;
	continuacao: string[];
};
