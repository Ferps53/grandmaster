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

export default function TelaCadastro() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [confirmarSenha, setConfirmarSenha] = useState("");
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
	const [campoFocado, setCampoFocado] = useState<string | null>(null);
	const [carregando, setCarregando] = useState(false);

	const { cadastrar } = useAutenticacao();

	async function handleCadastrar() {
		if (!nome || !email || !senha || !confirmarSenha) {
			Alert.alert("Erro", "Por favor, preencha todos os campos");
			return;
		}

		if (senha !== confirmarSenha) {
			Alert.alert("Erro", "As senhas não conferem");
			return;
		}

		if (senha.length < 6) {
			Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
			return;
		}

		setCarregando(true);
		try {
			await cadastrar(nome, email, senha);
			router.replace("/(tabs)");
		} catch (erro) {
			Alert.alert(
				"Erro ao cadastrar",
				erro instanceof Error
					? erro.message
					: "Verifique os dados e tente novamente",
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
							<Text style={estilos.tituloCartao}>Crie sua Conta</Text>
						</View>

						<View style={estilos.grupoCampo}>
							<Text style={estilos.labelCampo}>Nome Completo</Text>
							<View
								style={[
									estilos.inputWrapper,
									campoFocado === "nome" && estilos.inputWrapperFocado,
								]}
							>
								<MaterialCommunityIcons
									name="account"
									size={20}
									color={
										campoFocado === "nome" ? tema.verde : tema.textoSecundario
									}
								/>
								<TextInput
									style={estilos.input}
									placeholder="Seu nome"
									placeholderTextColor={tema.textoMudo}
									value={nome}
									onChangeText={setNome}
									onFocus={() => setCampoFocado("nome")}
									onBlur={() => setCampoFocado(null)}
									autoCapitalize="words"
									editable={!carregando}
								/>
							</View>
						</View>

						<View style={estilos.grupoCampo}>
							<Text style={estilos.labelCampo}>E-mail</Text>
							<View
								style={[
									estilos.inputWrapper,
									campoFocado === "email" && estilos.inputWrapperFocado,
								]}
							>
								<MaterialCommunityIcons
									name="at"
									size={20}
									color={
										campoFocado === "email" ? tema.verde : tema.textoSecundario
									}
								/>
								<TextInput
									style={estilos.input}
									placeholder="seu.email@exemplo.com"
									placeholderTextColor={tema.textoMudo}
									value={email}
									onChangeText={setEmail}
									onFocus={() => setCampoFocado("email")}
									onBlur={() => setCampoFocado(null)}
									autoCapitalize="none"
									keyboardType="email-address"
									editable={!carregando}
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
									editable={!carregando}
								/>
								<Pressable
									onPress={() => setMostrarSenha((v) => !v)}
									hitSlop={8}
									disabled={carregando}
								>
									<MaterialCommunityIcons
										name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
										size={20}
										color={tema.textoSecundario}
									/>
								</Pressable>
							</View>
						</View>

						<View style={estilos.grupoCampo}>
							<Text style={estilos.labelCampo}>Confirme sua senha</Text>
							<View
								style={[
									estilos.inputWrapper,
									campoFocado === "confirmarSenha" &&
										estilos.inputWrapperFocado,
								]}
							>
								<MaterialCommunityIcons
									name="lock-outline"
									size={20}
									color={
										campoFocado === "confirmarSenha"
											? tema.verde
											: tema.textoSecundario
									}
								/>
								<TextInput
									style={estilos.input}
									placeholder="••••••••••"
									placeholderTextColor={tema.textoMudo}
									value={confirmarSenha}
									onChangeText={setConfirmarSenha}
									onFocus={() => setCampoFocado("confirmarSenha")}
									onBlur={() => setCampoFocado(null)}
									secureTextEntry={!mostrarConfirmarSenha}
									editable={!carregando}
								/>
								<Pressable
									onPress={() => setMostrarConfirmarSenha((v) => !v)}
									hitSlop={8}
									disabled={carregando}
								>
									<MaterialCommunityIcons
										name={
											mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"
										}
										size={20}
										color={tema.textoSecundario}
									/>
								</Pressable>
							</View>
						</View>
						<Pressable
							style={({ pressed }) => [
								estilos.botaoEntrar,
								pressed && estilos.botaoEntrarPressionado,
								carregando && { opacity: 0.6 },
							]}
							onPress={handleCadastrar}
							disabled={carregando}
						>
							{carregando ? (
								<ActivityIndicator color={tema.bg} />
							) : (
								<Text style={estilos.textoBotaoEntrar}>Criar Conta</Text>
							)}
						</Pressable>
					</View>

					<View style={estilos.rodape}>
						<Text style={estilos.textoRodape}>Já tem uma conta? </Text>
						<Link href="/" asChild>
							<Pressable hitSlop={16}>
								<Text style={estilos.linkRodape}>Faça login</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
