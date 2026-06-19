/// <reference types="bun-types" />
/**
 * Importador de subset do Lichess Open Puzzle DB (CC0).
 *
 * Uso:
 *   1. Baixar https://database.lichess.org/lichess_db_puzzle.csv.zst
 *   2. Descompactar:  zstd -d lichess_db_puzzle.csv.zst
 *   3. Rodar:         bun api/scripts/importar-puzzles-lichess.ts <caminho-do-csv>
 *   4. Gera api/migrations/005_seed-puzzles.sql (commitar resultado)
 *
 * Estratégia: amostra ~5000 puzzles distribuídos por faixa de rating
 * (400..2400 em buckets de 100). Mantém só puzzles de popularidade >= 80
 * pra evitar lixo. Coluna CSV:
 *   PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
 */

import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createInterface } from "node:readline";

const BUCKET_MIN = 400;
const BUCKET_MAX = 2400;
const BUCKET_TAMANHO = 100;
const POR_BUCKET = 250;
const POPULARIDADE_MINIMA = 80;
const LOTE_INSERT = 500;
const SAIDA = join(import.meta.dir, "..", "migrations", "005_seed-puzzles.sql");

type Puzzle = {
	id: string;
	fen: string;
	lances: string[];
	rating: number;
	popularidade: number;
	temas: string[];
};

function bucketDe(rating: number): number | null {
	if (rating < BUCKET_MIN || rating >= BUCKET_MAX) {
		return null;
	}
	return BUCKET_MIN + Math.floor((rating - BUCKET_MIN) / BUCKET_TAMANHO) * BUCKET_TAMANHO;
}

function criarBuckets(): Map<number, Puzzle[]> {
	const buckets = new Map<number, Puzzle[]>();
	for (let r = BUCKET_MIN; r < BUCKET_MAX; r += BUCKET_TAMANHO) {
		buckets.set(r, []);
	}
	return buckets;
}

function parsearLinha(linha: string): Puzzle | null {
	const cols = linha.split(",");
	if (cols.length < 8) {
		return null;
	}
	const rating = Number.parseInt(cols[3], 10);
	const popularidade = Number.parseInt(cols[5], 10);
	if (Number.isNaN(rating) || Number.isNaN(popularidade)) {
		return null;
	}
	if (popularidade < POPULARIDADE_MINIMA) {
		return null;
	}
	return {
		id: cols[0],
		fen: cols[1],
		lances: cols[2].split(" "),
		rating,
		popularidade,
		temas: cols[7].split(" ").filter(Boolean),
	};
}

async function coletarPuzzles(caminhoCsv: string): Promise<Puzzle[]> {
	const buckets = criarBuckets();
	const stream = createReadStream(caminhoCsv, { encoding: "utf-8" });
	const rl = createInterface({ input: stream, crlfDelay: Infinity });

	let primeira = true;
	let lidas = 0;

	for await (const linha of rl) {
		if (primeira) {
			primeira = false;
			continue;
		}
		lidas++;

		const puzzle = parsearLinha(linha);
		if (puzzle === null) {
			continue;
		}

		const bucket = bucketDe(puzzle.rating);
		if (bucket === null) {
			continue;
		}

		const arr = buckets.get(bucket);
		if (arr === undefined || arr.length >= POR_BUCKET) {
			continue;
		}
		arr.push(puzzle);

		if (lidas % 200_000 === 0) {
			const total = [...buckets.values()].reduce((a, b) => a + b.length, 0);
			console.log(`Lidas ${lidas} linhas. Coletadas ${total}.`);
		}
	}

	return [...buckets.values()].flat();
}

function escaparTexto(s: string): string {
	return s.replace(/'/g, "''");
}

function literalArray(arr: string[]): string {
	const escapados = arr.map((x) => `"${x.replace(/"/g, '\\"')}"`).join(",");
	return `'{${escapados}}'`;
}

function linhaValores(p: Puzzle): string {
	return `  ('${escaparTexto(p.id)}', '${escaparTexto(p.fen)}', ${literalArray(p.lances)}, ${p.rating}, ${p.popularidade}, ${literalArray(p.temas)})`;
}

function gerarSql(puzzles: Puzzle[]): string {
	let sql = "-- Seed gerado por scripts/importar-puzzles-lichess.ts\n";
	sql += "-- Fonte: Lichess Open Puzzle DB (CC0)\n\n";

	for (let i = 0; i < puzzles.length; i += LOTE_INSERT) {
		const fatia = puzzles.slice(i, i + LOTE_INSERT);
		sql += "INSERT INTO puzzles (id, fen, lances_solucao, rating, popularidade, temas) VALUES\n";
		sql += fatia.map(linhaValores).join(",\n");
		sql += "\nON CONFLICT (id) DO NOTHING;\n\n";
	}

	return sql;
}

async function main(): Promise<void> {
	const caminhoCsv = process.argv[2];
	if (!caminhoCsv) {
		console.error("Erro: passe o caminho do CSV descompactado como argumento.");
		console.error("Ex: bun api/scripts/importar-puzzles-lichess.ts ./lichess_db_puzzle.csv");
		process.exit(1);
	}

	const puzzles = await coletarPuzzles(caminhoCsv);
	console.log(`Total selecionado: ${puzzles.length} puzzles.`);

	const sql = gerarSql(puzzles);
	await writeFile(SAIDA, sql, "utf-8");
	console.log(`Escrito ${SAIDA}`);
}

await main();
