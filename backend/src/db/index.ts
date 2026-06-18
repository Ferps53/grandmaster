import { sql } from "bun";

export interface Usuario {
	id: string;
	nome: string;
	email: string;
	senha: string;
	criadoEm: string;
}

interface UsuarioRow {
	id: string;
	nome: string;
	email: string;
	senha: string;
	criado_em: string;
}

function rowToUsuario(row: UsuarioRow): Usuario {
	return {
		id: row.id,
		nome: row.nome,
		email: row.email,
		senha: row.senha,
		criadoEm: new Date(row.criado_em).toISOString(),
	};
}

export const db = {
	async conectar(): Promise<void> {
		await sql`SELECT 1`;
		console.log("Banco de dados conectado.");
	},

	async getUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
		const rows = await sql<UsuarioRow[]>`
      SELECT * FROM usuarios WHERE email = ${email} LIMIT 1
    `;
		return rows[0] ? rowToUsuario(rows[0]) : undefined;
	},

	async getUsuarioPorId(id: string): Promise<Usuario | undefined> {
		const rows = await sql<UsuarioRow[]>`
      SELECT * FROM usuarios WHERE id = ${id} LIMIT 1
    `;
		return rows[0] ? rowToUsuario(rows[0]) : undefined;
	},

	async criarUsuario(dados: Omit<Usuario, "id" | "criadoEm">): Promise<Usuario> {
		const rows = await sql<UsuarioRow[]>`
      INSERT INTO usuarios (nome, email, senha)
      VALUES (${dados.nome}, ${dados.email}, ${dados.senha})
      RETURNING *
    `;
		return rowToUsuario(rows[0]);
	},
};
