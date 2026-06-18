// Alterear o URL da API para apontar para o backend

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
