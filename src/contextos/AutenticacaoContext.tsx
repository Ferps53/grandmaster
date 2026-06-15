import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import servicoAPI from "../servicos/api";

interface Usuario {
	id: string;
	email: string;
	nome: string;
}

interface ContextoAutenticacao {
	usuario: Usuario | null;
	token: string | null;
	carregando: boolean;
	entrar: (email: string, senha: string) => Promise<void>;
	cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
	sair: () => Promise<void>;
	erro: string | null;
}

const ContextoAuth = createContext<ContextoAutenticacao | undefined>(undefined);

export function ProveedorAutenticacao({
	children,
}: {
	children: React.ReactNode;
}) {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [carregando, setCarregando] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		restaurarSessao();
	}, []);

	async function restaurarSessao() {
		try {
			const tokenArmazenado = await AsyncStorage.getItem("token_auth");
			const usuarioArmazenado = await AsyncStorage.getItem("usuario_auth");

			if (tokenArmazenado && usuarioArmazenado) {
				const valido = await servicoAPI.verificarToken(tokenArmazenado);

				if (valido) {
					setToken(tokenArmazenado);
					setUsuario(JSON.parse(usuarioArmazenado));
				} else {
					await AsyncStorage.removeItem("token_auth");
					await AsyncStorage.removeItem("usuario_auth");
				}
			}
		} catch (err) {
			console.error("Erro ao restaurar sessão:", err);
		} finally {
			setCarregando(false);
		}
	}

	async function entrar(email: string, senha: string) {
		setErro(null);
		try {
			const resposta = await servicoAPI.login(email, senha);

			setToken(resposta.token);
			setUsuario(resposta.usuario);

			await AsyncStorage.setItem("token_auth", resposta.token);
			await AsyncStorage.setItem(
				"usuario_auth",
				JSON.stringify(resposta.usuario)
			);
		} catch (err) {
			const mensagem =
				err instanceof Error ? err.message : "Erro ao fazer login";
			setErro(mensagem);
			throw err;
		}
	}

	async function cadastrar(nome: string, email: string, senha: string) {
		setErro(null);
		try {
			const resposta = await servicoAPI.cadastro(nome, email, senha);

			setToken(resposta.token);
			setUsuario({
				id: resposta.id,
				email: resposta.email,
				nome: resposta.nome,
			});

			await AsyncStorage.setItem("token_auth", resposta.token);
			await AsyncStorage.setItem(
				"usuario_auth",
				JSON.stringify({
					id: resposta.id,
					email: resposta.email,
					nome: resposta.nome,
				})
			);
		} catch (err) {
			const mensagem =
				err instanceof Error
					? err.message
					: "Erro ao fazer cadastro";
			setErro(mensagem);
			throw err;
		}
	}

	async function sair() {
		setToken(null);
		setUsuario(null);
		setErro(null);

		await AsyncStorage.removeItem("token_auth");
		await AsyncStorage.removeItem("usuario_auth");
	}

	return (
		<ContextoAuth.Provider
			value={{
				usuario,
				token,
				carregando,
				entrar,
				cadastrar,
				sair,
				erro,
			}}
		>
			{children}
		</ContextoAuth.Provider>
	);
}

export function useAutenticacao() {
	const contexto = useContext(ContextoAuth);

	if (!contexto) {
		throw new Error(
			"useAutenticacao deve ser usado dentro de ProveedorAutenticacao"
		);
	}

	return contexto;
}
