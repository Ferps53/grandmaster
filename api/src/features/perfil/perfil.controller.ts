import type { Request, Response } from "express";
import { perfilDb as db } from "./perfil.db";

const TENTATIVAS_PADRAO = 10;
const TENTATIVAS_MAXIMO = 50;

export const perfilController = {
	async obter(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}

			const limiteParam = Number.parseInt(String(req.query.limite ?? ""), 10);
			const limite =
				Number.isInteger(limiteParam) && limiteParam > 0
					? Math.min(limiteParam, TENTATIVAS_MAXIMO)
					: TENTATIVAS_PADRAO;

			const perfil = await db.obterPerfil(req.usuario.id, limite);
			if (!perfil) {
				return res.status(404).json({ mensagem: "Perfil não encontrado" });
			}
			return res.status(200).json(perfil);
		} catch (erro) {
			console.error("Erro ao obter perfil:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},
};
