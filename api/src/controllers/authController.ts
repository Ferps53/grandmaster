import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { usuariosDb as db } from "../db/usuarios";
import { gerarToken } from "../middleware/auth";

interface BodyLogin {
	email: string;
	senha: string;
}

interface BodyCadastro {
	nome: string;
	email: string;
	senha: string;
}

export const authController = {
	async login(req: Request<{}, {}, BodyLogin>, res: Response) {
		try {
			const { email, senha } = req.body;

			if (!email || !senha) {
				return res
					.status(400)
					.json({ mensagem: "Email e senha são obrigatórios" });
			}

			const usuario = await db.getUsuarioPorEmail(email);

			if (!usuario) {
				return res.status(401).json({ mensagem: "Email ou senha incorretos" });
			}

			const senhaValida = await bcrypt.compare(senha, usuario.senha);

			if (!senhaValida) {
				return res.status(401).json({ mensagem: "Email ou senha incorretos" });
			}

			const token = gerarToken({
				id: usuario.id,
				email: usuario.email,
				nome: usuario.nome,
			});

			return res.status(200).json({
				token,
				usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome },
			});
		} catch (erro) {
			console.error("Erro ao fazer login:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async cadastro(req: Request<{}, {}, BodyCadastro>, res: Response) {
		try {
			const { nome, email, senha } = req.body;

			if (!nome || !email || !senha) {
				return res
					.status(400)
					.json({ mensagem: "Nome, email e senha são obrigatórios" });
			}

			const usuarioExistente = await db.getUsuarioPorEmail(email);

			if (usuarioExistente) {
				return res
					.status(409)
					.json({ mensagem: "Email já cadastrado", campo: "email" });
			}

			const salt = await bcrypt.genSalt(10);
			const senhaHash = await bcrypt.hash(senha, salt);

			const novoUsuario = await db.criarUsuario({ nome, email, senha: senhaHash });

			const token = gerarToken({
				id: novoUsuario.id,
				email: novoUsuario.email,
				nome: novoUsuario.nome,
			});

			return res.status(201).json({
				id: novoUsuario.id,
				nome: novoUsuario.nome,
				email: novoUsuario.email,
				token,
			});
		} catch (erro) {
			console.error("Erro ao fazer cadastro:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async verificar(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}

			const usuario = await db.getUsuarioPorId(req.usuario.id);

			if (!usuario) {
				return res.status(404).json({ mensagem: "Usuário não encontrado" });
			}

			return res.status(200).json({
				id: usuario.id,
				email: usuario.email,
				nome: usuario.nome,
			});
		} catch (erro) {
			console.error("Erro ao verificar token:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},
};
