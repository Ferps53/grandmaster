import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tema from "../src/constantes/tema";
import { useAutenticacao } from "../src/contextos/AutenticacaoContext";
import estilos from "./estilos";

export default function TelaLogin() {
	const [identificador, setIdentificador] = useState("");
	const [senha, setSenha] = useState("");
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [campoFocado, setCampoFocado] = useState<string | null>(null);
	const [carregando, setCarregando] = useState(false);

	const { entrar } = useAutenticacao();

	async function handleEntrar() {
		if (!identificador || !senha) {
			Alert.alert("Erro", "Por favor, preencha todos os campos");
			return;
		}

		setCarregando(true);
		try {
			await entrar(identificador, senha);
			router.replace("/(tabs)");
		} catch (erro) {
			Alert.alert(
				"Erro ao fazer login",
				erro instanceof Error ? erro.message : "Verifique suas credenciais",
			);
		} finally {
			setCarregando(false);
		}
	}

	return (
		<SafeAreaView style={estilos.root} edges={["bottom", "top"]}>
			<KeyboardAvoidingView
				style={estilos.root}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={estilos.conteudo}>
					<View style={estilos.cabecalho}>
						<View style={estilos.iconeWrapper}>
							<MaterialCommunityIcons
								name="chess-bishop"
								size={36}
								color={tema.verde}
							/>
						</View>
						<Text style={estilos.titulo}>Grandmaster</Text>
						<Text style={estilos.subtitulo}>THE INTELLECTUAL SANCTUARY</Text>
					</View>

					<View style={estilos.cartao}>
						<View style={estilos.cabecalhoCartao}>
							<Text style={estilos.tituloCartao}>Bem-vindo de Volta</Text>
						</View>

						<View style={estilos.grupoCampo}>
							<Text style={estilos.labelCampo}>E-mail</Text>
							<View
								style={[
									estilos.inputWrapper,
									campoFocado === "id" && estilos.inputWrapperFocado,
								]}
							>
								<MaterialCommunityIcons
									name="at"
									size={20}
									color={
										campoFocado === "id" ? tema.verde : tema.textoSecundario
									}
								/>
								<TextInput
									style={estilos.input}
									placeholder="E-mail ou Usuário"
									placeholderTextColor={tema.textoMudo}
									value={identificador}
									onChangeText={setIdentificador}
									onFocus={() => setCampoFocado("id")}
									onBlur={() => setCampoFocado(null)}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							</View>
						</View>

						<View style={estilos.grupoCampo}>
							<Text style={estilos.labelCampo}>Senha</Text>
							<View
								style={[
									estilos.inputWrapper,
									campoFocado === "senha" && estilos.inputWrapperFocado,
								]}
							>
								<MaterialCommunityIcons
									name="lock-outline"
									size={20}
									color={
										campoFocado === "senha" ? tema.verde : tema.textoSecundario
									}
								/>
								<TextInput
									style={estilos.input}
									placeholder="••••••••••"
									placeholderTextColor={tema.textoMudo}
									value={senha}
									onChangeText={setSenha}
									onFocus={() => setCampoFocado("senha")}
									onBlur={() => setCampoFocado(null)}
									secureTextEntry={!mostrarSenha}
								/>
								<Pressable
									onPress={() => setMostrarSenha((v) => !v)}
									hitSlop={8}
								>
									<MaterialCommunityIcons
										name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
										size={20}
										color={tema.textoSecundario}
									/>
								</Pressable>
							</View>
							<Pressable style={estilos.botaoEsqueceu}>
								<Text style={estilos.linkEsqueceu}>Esqueceu a senha?</Text>
							</Pressable>
						</View>

						<Pressable
							style={({ pressed }) => [
								estilos.botaoEntrar,
								pressed && estilos.botaoEntrarPressionado,
								carregando && { opacity: 0.6 },
							]}
							onPress={handleEntrar}
							disabled={carregando}
						>
							{carregando ? (
								<ActivityIndicator color={tema.bg} />
							) : (
								<Text style={estilos.textoBotaoEntrar}>Entrar</Text>
							)}
						</Pressable>
					</View>

					<View style={estilos.rodape}>
						<Text style={estilos.textoRodape}>Novo por aqui? </Text>
						<Link href="/register" asChild>
							<Pressable hitSlop={16}>
								<Text style={estilos.linkRodape}>Crie sua conta</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
