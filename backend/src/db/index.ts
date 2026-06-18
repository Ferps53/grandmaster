import { sql } from "bun";

export async function conectar(): Promise<void> {
	await sql`SELECT 1`;
	console.log("Banco de dados conectado.");
}
