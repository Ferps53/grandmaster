import { sql } from "bun";

export type StatusLicao = "concluida" | "atual" | "bloqueada";

export interface LicaoComStatus {
	id: string;
	titulo: string;
	icone: string;
	status: StatusLicao;
}

export interface PassoLicao {
	ordem: number;
	instrucao: string;
	dica?: string;
	fen: string;
	movimentoEsperado: { from: string; to: string };
	destaques: { square: string; color: string }[];
	respostaComputador: { from: string; to: string } | null;
}

export interface LicaoCompleta {
	id: string;
	titulo: string;
	descricao: string;
	passos: PassoLicao[];
}

interface LicaoRow {
	id: string;
	titulo: string;
	icone: string;
	ordem: number;
}

interface PassoRow {
	id: string;
	ordem: number;
	instrucao: string;
	dica: string | null;
	fen: string;
	movimento_from: string;
	movimento_to: string;
	resposta_from: string | null;
	resposta_to: string | null;
}

interface DestaqueRow {
	passo_id: string;
	square: string;
	color: string;
}

export const licoesDb = {
	async getLicoesComStatus(usuarioId: string): Promise<LicaoComStatus[]> {
		const licoes = await sql<LicaoRow[]>`
      SELECT id, titulo, icone, ordem FROM licoes ORDER BY ordem
    `;
		const concluidas = await sql<{ licao_id: string }[]>`
      SELECT licao_id FROM progresso_licoes WHERE usuario_id = ${usuarioId}
    `;
		const concluidasSet = new Set(concluidas.map((r) => r.licao_id));

		let encontrouAtual = false;
		return licoes.map((l) => {
			if (concluidasSet.has(l.id)) return { id: l.id, titulo: l.titulo, icone: l.icone, status: "concluida" };
			if (!encontrouAtual) {
				encontrouAtual = true;
				return { id: l.id, titulo: l.titulo, icone: l.icone, status: "atual" };
			}
			return { id: l.id, titulo: l.titulo, icone: l.icone, status: "bloqueada" };
		});
	},

	async getLicaoComPassos(licaoId: string): Promise<LicaoCompleta | undefined> {
		const licoes = await sql<{ id: string; titulo: string; descricao: string }[]>`
      SELECT id, titulo, descricao FROM licoes WHERE id = ${licaoId}
    `;
		if (!licoes[0]) return undefined;

		const passos = await sql<PassoRow[]>`
      SELECT id, ordem, instrucao, dica, fen,
             movimento_from, movimento_to, resposta_from, resposta_to
      FROM passos_licao WHERE licao_id = ${licaoId} ORDER BY ordem
    `;

		const destaques = passos.length > 0
			? await sql<DestaqueRow[]>`
          SELECT d.passo_id, d.square, d.color
          FROM destaques_passo d
          JOIN passos_licao p ON d.passo_id = p.id
          WHERE p.licao_id = ${licaoId}
        `
			: [];

		const destaquesPorPasso = destaques.reduce<Record<string, { square: string; color: string }[]>>(
			(acc, d) => {
				if (!acc[d.passo_id]) acc[d.passo_id] = [];
				acc[d.passo_id].push({ square: d.square, color: d.color });
				return acc;
			},
			{},
		);

		return {
			...licoes[0],
			passos: passos.map((p) => ({
				ordem: p.ordem,
				instrucao: p.instrucao,
				dica: p.dica ?? undefined,
				fen: p.fen,
				movimentoEsperado: { from: p.movimento_from, to: p.movimento_to },
				destaques: destaquesPorPasso[p.id] ?? [],
				respostaComputador: p.resposta_from ? { from: p.resposta_from, to: p.resposta_to! } : null,
			})),
		};
	},

	async concluirLicao(usuarioId: string, licaoId: string): Promise<void> {
		await sql`
      INSERT INTO progresso_licoes (usuario_id, licao_id)
      VALUES (${usuarioId}, ${licaoId})
      ON CONFLICT (usuario_id, licao_id) DO NOTHING
    `;
	},
};
