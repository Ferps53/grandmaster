import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tema from "../src/constantes/tema";

export default function TelaLogin() {
	const [identificador, setIdentificador] = useState("");
	const [senha, setSenha] = useState("");
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [campoFocado, setCampoFocado] = useState<string | null>(null);

	function handleEntrar() {
		router.replace("/(tabs)");
	}

	return (
		<SafeAreaView style={estilos.root} edges={["bottom"]}>
			<KeyboardAvoidingView
				style={estilos.root}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={estilos.conteudo}>
					{/* Cabeçalho */}
					<View style={estilos.cabecalho}>
						<View style={estilos.iconeWrapper}>
							<MaterialCommunityIcons
								name="chess-pawn"
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
							]}
							onPress={handleEntrar}
						>
							<Text style={estilos.textoBotaoEntrar}>Entrar</Text>
						</Pressable>
					</View>

					<View style={estilos.rodape}>
						<Text style={estilos.textoRodape}>Novo por aqui?</Text>
						<Link href="/register" asChild>
							<Pressable>
								<Text style={estilos.linkRodape}>Crie sua conta</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},
	conteudo: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
		gap: 24,
	},
	// Cabeçalho
	cabecalho: {
		alignItems: "center",
		gap: 8,
	},
	iconeWrapper: {
		width: 72,
		height: 72,
		borderRadius: 16,
		backgroundColor: tema.surface,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: tema.borda,
		marginBottom: 8,
	},
	titulo: {
		fontSize: 40,
		fontStyle: "italic",
		fontWeight: "700",
		color: tema.verde,
		letterSpacing: -1,
	},
	subtitulo: {
		fontSize: 11,
		color: tema.textoSecundario,
		letterSpacing: 3,
	},
	// Cartão
	cartao: {
		width: "100%",
		backgroundColor: tema.surface,
		borderRadius: 20,
		padding: 24,
		borderWidth: 1,
		borderColor: tema.borda,
		gap: 20,
	},
	cabecalhoCartao: {
		gap: 4,
	},
	tituloCartao: {
		fontSize: 26,
		fontWeight: "700",
		color: tema.textoPrimario,
	},
	subtituloCartao: {
		fontSize: 14,
		color: tema.textoSecundario,
		lineHeight: 20,
	},
	// Campos
	grupoCampo: {
		gap: 8,
	},
	labelCampo: {
		fontSize: 11,
		fontWeight: "600",
		color: tema.textoSecundario,
		letterSpacing: 1.5,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: tema.surfaceAlt,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: tema.borda,
		paddingHorizontal: 14,
		height: 52,
		gap: 10,
	},
	inputWrapperFocado: {
		borderColor: tema.verde,
	},
	input: {
		flex: 1,
		color: tema.textoPrimario,
		fontSize: 15,
	},
	botaoEsqueceu: {
		alignSelf: "flex-end",
	},
	linkEsqueceu: {
		fontSize: 12,
		fontWeight: "600",
		color: tema.verde,
	},
	// Botão entrar
	botaoEntrar: {
		backgroundColor: tema.verde,
		borderRadius: 10,
		height: 52,
		alignItems: "center",
		justifyContent: "center",
	},
	botaoEntrarPressionado: {
		opacity: 0.85,
	},
	textoBotaoEntrar: {
		color: "#0d1117",
		fontSize: 16,
		fontWeight: "700",
	},
	// Rodapé
	rodape: {
		flexDirection: "row",
		alignItems: "center",
	},
	textoRodape: {
		fontSize: 14,
		color: tema.textoSecundario,
	},
	linkRodape: {
		fontSize: 14,
		color: tema.verde,
		fontWeight: "600",
	},
});
