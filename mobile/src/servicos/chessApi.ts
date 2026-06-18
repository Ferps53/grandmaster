import { Chess } from "chess.js";
import type { AnaliseChessApi } from "@/src/model/Analise";

const CHESS_API_URL = "https://chess-api.com/v1";

function normalizarFen(fen: string): string {
	try {
		const c = new Chess(fen);
		const temEp = c.moves({ verbose: true }).some((m) => m.flags.includes("e"));
		if (temEp) return fen;
		const partes = fen.split(" ");
		if (partes.length >= 4 && partes[3] !== "-") {
			partes[3] = "-";
			return partes.join(" ");
		}
		return fen;
	} catch {
		return fen;
	}
}

type RespostaBruta = {
	eval?: number;
	mate?: number | null;
	move?: string;
	san?: string;
	depth?: number;
	winChance?: number;
	text?: string;
	type?: string;
	continuationArr?: string[];
};

export async function analisarPosicao(
	fen: string,
	depth = 12,
	signal?: AbortSignal,
): Promise<AnaliseChessApi> {
	try {
		const fenEnvio = normalizarFen(fen);
		const resposta = await fetch(CHESS_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ fen: fenEnvio, depth }),
			signal,
		});

		if (!resposta.ok) {
			throw new Error(`Erro chess-api: ${resposta.status}`);
		}

		const texto = await resposta.text();

		const parsedos: RespostaBruta[] = [];
		try {
			const unico = JSON.parse(texto);
			if (Array.isArray(unico)) {
				parsedos.push(...(unico as RespostaBruta[]));
			} else {
				parsedos.push(unico as RespostaBruta);
			}
		} catch {
			const linhas = texto
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean);
			for (const linha of linhas) {
				try {
					parsedos.push(JSON.parse(linha) as RespostaBruta);
				} catch {
					// ignora linhas inválidas
				}
			}
		}

		const comContinuacao = parsedos.filter(
			(p) => p.continuationArr && p.continuationArr.length > 0,
		);
		const melhorProfundidade = comContinuacao.sort(
			(a, b) => (b.depth ?? 0) - (a.depth ?? 0),
		)[0];
		const ultimoComMove = [...parsedos].reverse().find((p) => p.move);
		const dados: RespostaBruta = {
			...(ultimoComMove ?? parsedos[parsedos.length - 1] ?? {}),
			continuationArr:
				melhorProfundidade?.continuationArr ??
				ultimoComMove?.continuationArr ??
				[],
		};

		const continuacao = [
			...(dados.move ? [dados.move] : []),
			...(dados.continuationArr ?? []),
		];
		return {
			fen,
			avaliacao: dados.eval ?? 0,
			melhorLance: dados.move ?? "",
			melhorLanceSan: dados.san ?? "",
			profundidade: dados.depth ?? depth,
			mate: dados.mate ?? undefined,
			chanceVitoria: dados.winChance,
			texto: dados.text,
			continuacao,
		};
	} catch (erro) {
		if ((erro as Error).name === "AbortError") throw erro;
		console.error("Erro ao analisar posição:", erro);
		throw erro;
	}
}
