import tema from "@/src/constantes/tema";
import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import type { Perfil } from "@/src/model/Perfil";
import servicoAPI from "@/src/servicos/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	ImageBackground,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import estilos from "../estilos";

const LIMITE_RD_PROVISORIO = 110;

export default function TelaInicio() {
	const { token } = useAutenticacao();
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [carregando, setCarregando] = useState(true);

	const carregar = useCallback(async () => {
		if (!token) {
			return;
		}
		try {
			const dados = await servicoAPI.obterPerfil(token);
			setPerfil(dados);
		} catch (err) {
			console.error("Erro ao carregar perfil:", err);
		} finally {
			setCarregando(false);
		}
	}, [token]);

	useFocusEffect(
		useCallback(() => {
			void carregar();
		}, [carregar]),
	);

	const ratingExibido = perfil ? Math.round(perfil.rating) : null;
	const provisorio = perfil ? perfil.rd > LIMITE_RD_PROVISORIO : false;

	return (
		<ScrollView style={{ gap: 16 }}>
			<ImageBackground
				source={require("../../assets/images/jogar_agora.webp")}
				style={estilo.banner}
				imageStyle={{ borderRadius: 16 }}
			>
				<View style={estilo.bannerConteudo}>
					<View>
						<Text style={estilo.bannerTitulo}>O tabuleiro te espera</Text>
						<Text style={estilo.bannerSubtitulo}>
							Resolva puzzles táticos e ganhe rating.
						</Text>
					</View>
					<Pressable
						style={estilos.botaoEntrar}
						onPress={() => {
							router.replace("/(tabs)/puzzles");
						}}
					>
						<Text style={estilos.textoBotaoEntrar}>Jogar agora</Text>
					</Pressable>
				</View>
			</ImageBackground>

			<View style={estilo.cartao}>
				<Text style={estilo.ratingTexto}>Rating de puzzles</Text>
				{carregando || ratingExibido === null ? (
					<View style={estilo.ratingLoader}>
						<ActivityIndicator color={tema.verde} size="large" />
					</View>
				) : (
					<Text style={estilo.rating}>
						{ratingExibido}
						{provisorio ? "?" : ""}
					</Text>
				)}
			</View>

			<View style={estilo.banner}>
				<View style={estilo.bannerLicoesFundo}>
					<MaterialCommunityIcons
						name="school"
						size={160}
						color={tema.verde}
						style={estilo.bannerLicoesIcone}
					/>
					<View style={estilo.bannerConteudo}>
						<View>
							<Text style={estilo.bannerTitulo}>Aprenda xadrez</Text>
							<Text style={estilo.bannerSubtitulo}>
								Domine táticas e aberturas em lições passo a passo.
							</Text>
						</View>
						<Pressable
							style={estilos.botaoEntrar}
							onPress={() => {
								router.replace("/(tabs)/aprender");
							}}
						>
							<Text style={estilos.textoBotaoEntrar}>Começar lições</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const estilo = StyleSheet.create({
	banner: {
		borderRadius: 16,
		overflow: "hidden",
		margin: 16,
		flexDirection: "column",
		height: 300,
		borderWidth: 4,
		borderColor: tema.surfaceAlt,
	},
	bannerLicoesFundo: {
		flex: 1,
		backgroundColor: tema.surface,
	},
	bannerLicoesIcone: {
		position: "absolute",
		right: -20,
		bottom: -20,
		opacity: 0.15,
	},
	cartao: {
		borderRadius: 16,
		margin: 16,
		padding: 16,
		alignItems: "center",
		flexDirection: "column",
		backgroundColor: tema.surface,
	},
	bannerConteudo: {
		gap: 8,
		flex: 1,
		padding: 20,
		justifyContent: "space-between",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	bannerTitulo: {
		color: tema.textoPrimario,
		fontSize: 36,
		marginBottom: 32,
		fontWeight: "700",
	},
	bannerSubtitulo: {
		color: tema.textoPrimario,
		fontSize: 16,
		fontWeight: "500",
	},
	rating: {
		color: tema.verde,
		padding: 4,
		fontSize: 72,
		letterSpacing: 2,
	},
	ratingTexto: {
		color: tema.textoPrimario,
		fontSize: 16,
		letterSpacing: 2,
		fontWeight: "100",
	},
	ratingLoader: {
		height: 88,
		justifyContent: "center",
	},
});
