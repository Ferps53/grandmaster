import type { TentativaPuzzle } from "./Puzzle";

export interface Perfil {
	id: string;
	nome: string;
	email: string;
	criadoEm: string;
	xp: number;
	rating: number;
	rd: number;
	volatilidade: number;
	tentativasRecentes: TentativaPuzzle[];
}
