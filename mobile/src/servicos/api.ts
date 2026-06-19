// Alterear o URL da API para apontar para o backend

import type { ConteudoLicao } from "@/src/model/ConteudoLicao";
import type { Perfil } from "@/src/model/Perfil";
import type {
	HistoricoPuzzles,
	PuzzleProximo,
	ResultadoPuzzle,
} from "@/src/model/Puzzle";

const API_URL =
	process.env.EXPO_PUBLIC_API_URL || "http://192.168.18.15:3000/api";

interface RespostaLogin {
	token: string;
	usuario: {
		id: string;
		email: string;
		nome: string;
	};
}

interface RespostaCadastro {
	id: string;
	email: string;
	nome: string;
	token: string;
}

export type StatusLicaoAPI = "concluida" | "atual" | "bloqueada";

export interface LicaoListaAPI {
	id: string;
	titulo: string;
	icone: string;
	status: StatusLicaoAPI;
}

class ServicoAPI {
	async login(email: string, senha: string): Promise<RespostaLogin> {
		try {
			const resposta = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					senha,
				}),
			});

			if (!resposta.ok) {
				const erro = await resposta.json();
				throw new Error(erro.mensagem || "Erro ao fazer login");
			}

			const dados: RespostaLogin = await resposta.json();
			return dados;
		} catch (erro) {
			console.error("Erro na requisição de login:", erro);
			throw erro;
		}
	}

	async cadastro(
		nome: string,
		email: string,
		senha: string,
	): Promise<RespostaCadastro> {
		try {
			const resposta = await fetch(`${API_URL}/auth/cadastro`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nome,
					email,
					senha,
				}),
			});

			if (!resposta.ok) {
				const erro = await resposta.json();
				throw new Error(erro.mensagem || "Erro ao fazer cadastro");
			}

			const dados: RespostaCadastro = await resposta.json();
			return dados;
		} catch (erro) {
			console.error("Erro na requisição de cadastro:", erro);
			throw erro;
		}
	}

	async listarLicoes(token: string): Promise<LicaoListaAPI[]> {
		const resposta = await fetch(`${API_URL}/licoes`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao listar lições");
		}
		return resposta.json();
	}

	async buscarLicao(token: string, id: string): Promise<ConteudoLicao> {
		const resposta = await fetch(`${API_URL}/licoes/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao buscar lição");
		}
		return resposta.json();
	}

	async concluirLicao(token: string, id: string): Promise<{ xpGanho: number }> {
		const resposta = await fetch(`${API_URL}/licoes/${id}/concluir`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao concluir lição");
		}
		const dados = await resposta.json();
		return { xpGanho: dados.xpGanho ?? 0 };
	}

	async obterProximoPuzzle(token: string): Promise<PuzzleProximo> {
		const resposta = await fetch(`${API_URL}/puzzles/proximo`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao buscar puzzle");
		}
		return resposta.json();
	}

	async enviarResultadoPuzzle(
		token: string,
		puzzleId: string,
		corpo: { lancesJogados: string[]; tentativas: number },
	): Promise<ResultadoPuzzle> {
		const resposta = await fetch(`${API_URL}/puzzles/${puzzleId}/resultado`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(corpo),
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao enviar resultado");
		}
		return resposta.json();
	}

	async obterHistoricoPuzzles(
		token: string,
		limite?: number,
	): Promise<HistoricoPuzzles> {
		const url = limite
			? `${API_URL}/puzzles/historico?limite=${limite}`
			: `${API_URL}/puzzles/historico`;
		const resposta = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao buscar histórico");
		}
		return resposta.json();
	}

	async obterPerfil(token: string, limite?: number): Promise<Perfil> {
		const url = limite
			? `${API_URL}/perfil?limite=${limite}`
			: `${API_URL}/perfil`;
		const resposta = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!resposta.ok) {
			const erro = await resposta.json().catch(() => ({}));
			throw new Error(erro.mensagem || "Erro ao buscar perfil");
		}
		return resposta.json();
	}

	async verificarToken(token: string): Promise<boolean> {
		try {
			const resposta = await fetch(`${API_URL}/auth/verificar`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return resposta.ok;
		} catch (erro) {
			console.error("Erro ao verificar token:", erro);
			return false;
		}
	}
}

export default new ServicoAPI();
