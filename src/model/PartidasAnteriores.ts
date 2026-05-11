export type PropsParidasAnteriores = {
	nome: string;
	elo: number;
	status: "V" | "E" | "D";
	ativo?: boolean;
	detalhes?: string;
	eloGanho?: string;
};
