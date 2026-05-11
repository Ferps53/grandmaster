import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import Chessboard from "react-native-chessboard";
import PartidasAnteriores from "@/src/componentes/PartidasAnteriores";
import tema from "@/src/constantes/tema";
import type { PropsParidasAnteriores } from "@/src/model/PartidasAnteriores";
import estilos from "../estilos";

const estilo = StyleSheet.create({
	banner: {
		borderRadius: 16,
		overflow: "hidden",
		margin: 16,
		display: "flex",
		flexDirection: "column",
		height: 300,
		borderWidth: 4,
		borderColor: tema.surfaceAlt,
	},

	cartao: {
		borderRadius: 16,
		margin: 16,
		padding: 16,
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		backgroundColor: tema.surface,
	},
	bannerConteudo: {
		gap: 8,
		flex: 1,
		padding: 20,
		justifyContent: "space-between",
		backgroundColor: "rgba(0,0,0,0.4)", // escurece a imagem para o texto ficar legível
	},
	botao: {
		borderRadius: 16,
		backgroundColor: tema.verde,
		height: 52,
		padding: 16,
		margin: "auto",
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
	ratingMelhoria: {
		fontSize: 14,
		color: tema.verde,
	},
});

const listPartidasAnteriores: PropsParidasAnteriores[] = [
	{ nome: "Magnus Carlsen", elo: 2840, status: "V", ativo: true },
	{ nome: "Levy Rozman", elo: 2318, status: "D", ativo: false },
	{ nome: "Felipe Brostolin Ribeiro", elo: 700, status: "E", ativo: false },
	{ nome: "Walter White", elo: 3600, status: "D", ativo: true },
];

export default function TelaInicio() {
	const { width } = useWindowDimensions();
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
							Jogue uma partida de xadrez para melhorar suas habilidades táticas
							no xadrez.
						</Text>
					</View>
					<Pressable
						style={estilos.botaoEntrar}
						onPress={() => {
							router.replace("/(tabs)/jogar");
						}}
					>
						<Text style={estilos.textoBotaoEntrar}>Jogar agora</Text>
					</Pressable>
				</View>
			</ImageBackground>
			<View style={estilo.cartao}>
				<Text style={estilo.ratingTexto}>Rating atual</Text>
				<Text style={estilo.rating}>2148</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						gap: 8,
						alignItems: "center",
					}}
				>
					<MaterialCommunityIcons
						name="trending-up"
						size={32}
						color={tema.verde}
					></MaterialCommunityIcons>
					<Text style={estilo.ratingMelhoria}>+12 desde a semana passada</Text>
				</View>
			</View>

			<View style={[estilo.cartao, { alignItems: "flex-start" }]}>
				<View
					style={{
						alignItems: "flex-start",
					}}
				>
					<Text style={[estilo.bannerTitulo, { marginLeft: 32 }]}>
						Quebra-cabeça diário
					</Text>
					<Text style={[estilo.bannerSubtitulo, { marginLeft: 32 }]}>
						Mate em 3
					</Text>
				</View>
				<View style={{ alignSelf: "center" }}>
					<Chessboard
						boardSize={width - 128}
						gestureEnabled={false}
						colors={{
							black: tema.textoMudo,
							white: tema.textoPrimario,
							lastMoveHighlight: "rgba(74, 222, 128, 0.3)",
						}}
					/>
				</View>
			</View>

			<Text style={[estilo.bannerTitulo, { marginLeft: 16, marginBottom: 12 }]}>
				Partidas anteriores
			</Text>
			{listPartidasAnteriores.map((partida) => (
				<PartidasAnteriores
					key={partida.nome}
					nome={partida.nome}
					elo={partida.elo}
					status={partida.status}
					ativo={partida.ativo}
				/>
			))}
		</ScrollView>
	);
}
