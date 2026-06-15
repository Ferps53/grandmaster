import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "usuarios.json");

interface Usuario {
	id: string;
	nome: string;
	email: string;
	senha: string;
	criadoEm: string;
}

interface BaseDados {
	usuarios: Usuario[];
}

function getDb(): BaseDados {
	if (!fs.existsSync(dbPath)) {
		const db: BaseDados = { usuarios: [] };
		fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
		return db;
	}

	const dados = fs.readFileSync(dbPath, "utf-8");
	return JSON.parse(dados);
}

function salvarDb(db: BaseDados): void {
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export const db = {
	getDb,
	salvarDb,
	getUsuarioPorEmail(email: string): Usuario | undefined {
		const dados = getDb();
		return dados.usuarios.find((u) => u.email === email);
	},
	getUsuarioPorId(id: string): Usuario | undefined {
		const dados = getDb();
		return dados.usuarios.find((u) => u.id === id);
	},
	criarUsuario(usuario: Usuario): Usuario {
		const dados = getDb();
		dados.usuarios.push(usuario);
		salvarDb(dados);
		return usuario;
	},
};
