/// <reference types="bun-types" />
import { sql } from "bun";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

await sql`
  CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

const applied = await sql`SELECT name FROM _migrations`;
const appliedSet = new Set(applied.map((r: { name: string }) => r.name));

const dir = join(import.meta.dir, "migrations");
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
	if (appliedSet.has(file)) {
		console.log(`Skipped (already applied): ${file}`);
		continue;
	}

	const content = await readFile(join(dir, file), "utf-8");
	await sql.begin(async (tx: typeof sql) => {
		await tx.unsafe(content);
		await tx`INSERT INTO _migrations (name) VALUES (${file})`;
	});
	console.log(`Applied: ${file}`);
}

console.log("Migrations concluídas.");
await sql.close();
process.exit(0);
