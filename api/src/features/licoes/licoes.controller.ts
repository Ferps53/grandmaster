import type { Request, Response } from "express";
import { licoesDb as db } from "./licoes.db";

export const licoesController = {
	async listar(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}
			const licoes = await db.getLicoesComStatus(req.usuario.id);
			return res.status(200).json(licoes);
		} catch (erro) {
			console.error("Erro ao listar lições:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async buscarPorId(req: Request, res: Response) {
		try {
			const licao = await db.getLicaoComPassos(req.params.id);
			if (!licao) {
				return res.status(404).json({ mensagem: "Lição não encontrada" });
			}
			return res.status(200).json(licao);
		} catch (erro) {
			console.error("Erro ao buscar lição:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},

	async concluir(req: Request, res: Response) {
		try {
			if (!req.usuario) {
				return res.status(401).json({ mensagem: "Não autenticado" });
			}
			const xpGanho = await db.concluirLicao(req.usuario.id, req.params.id);
			return res.status(200).json({
				mensagem: "Lição concluída",
				licaoId: req.params.id,
				xpGanho,
			});
		} catch (erro) {
			console.error("Erro ao concluir lição:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},
};
