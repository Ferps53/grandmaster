import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import tema from "@/src/constantes/tema";
import estilos from "../estilos";
import { router } from "expo-router";

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
		marginBottom: 20,
		fontWeight: "700",
	},

	bannerSubtitulo: {
		color: tema.textoPrimario,
		fontSize: 16,
		fontWeight: "500",
	},
});

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
				<View>
					<MaterialCommunityIcons></MaterialCommunityIcons>
					<Text style={estilo.ratingMelhoria}>+12 desde a semana passada</Text>
				</View>
			</View>

			<View style={estilo.cartao}>
				<View>
					<Text style={estilo.bannerTitulo}>Quebra-cabeça Diário</Text>
					<Text style={estilo.bannerSubtitulo}>Mate em 3</Text>
				</View>
				<View>
					<Chessboard
						boardSize={width - 64}
						colors={{
							black: tema.bg,
							white: tema.textoPrimario,
							lastMoveHighlight: "rgba(74, 222, 128, 0.3)",
						}}
					/>
				</View>
			</View>
		</ScrollView>
	);
}
