import { Request, Response } from "express";
import { licoesDb as db } from "../db/licoes";

export const licoesController = {
	async listar(req: Request, res: Response) {
		try {
			const licoes = await db.getLicoesComStatus(req.usuario!.id);
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
			await db.concluirLicao(req.usuario!.id, req.params.id);
			return res.status(200).json({ mensagem: "Lição concluída", licaoId: req.params.id });
		} catch (erro) {
			console.error("Erro ao concluir lição:", erro);
			return res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	},
};
