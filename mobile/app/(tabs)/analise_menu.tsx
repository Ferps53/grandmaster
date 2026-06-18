import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import tema from "@/src/constantes/tema";

export default function TelaMenuAnalise() {
	const router = useRouter();

	return (
		<View style={estilos.root}>
			<Text style={estilos.titulo}>Analisar partidas</Text>
			<Text style={estilos.subtitulo}>Escolha como deseja começar</Text>

			<Pressable
				style={estilos.cartao}
				onPress={() =>
					router.push({
						pathname: "/(tabs)/analise/[modo]",
						params: { modo: "nova" },
					})
				}
			>
				<View style={estilos.iconeWrapper}>
					<MaterialCommunityIcons
						name="chess-king"
						size={28}
						color={tema.verde}
					/>
				</View>
				<View style={estilos.cartaoTextos}>
					<Text style={estilos.cartaoTitulo}>Nova análise</Text>
					<Text style={estilos.cartaoSubtitulo}>
						Faça jogadas a partir da posição inicial
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={tema.textoSecundario}
				/>
			</Pressable>

			<Pressable
				style={estilos.cartao}
				onPress={() =>
					router.push({
						pathname: "/(tabs)/analise/[modo]",
						params: { modo: "pgn" },
					})
				}
			>
				<View style={estilos.iconeWrapper}>
					<MaterialCommunityIcons
						name="file-import"
						size={28}
						color={tema.verde}
					/>
				</View>
				<View style={estilos.cartaoTextos}>
					<Text style={estilos.cartaoTitulo}>Importar PGN</Text>
					<Text style={estilos.cartaoSubtitulo}>
						Faça a importação de qualquer jogo
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={tema.textoSecundario}
				/>
			</Pressable>
		</View>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
		padding: 16,
		gap: 12,
	},
	titulo: {
		color: tema.textoPrimario,
		fontSize: 22,
		fontWeight: "700",
	},
	subtitulo: {
		color: tema.textoSecundario,
		fontSize: 13,
		marginBottom: 8,
	},
	cartao: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		backgroundColor: tema.surface,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: tema.borda,
		padding: 16,
	},
	iconeWrapper: {
		width: 52,
		height: 52,
		borderRadius: 12,
		backgroundColor: tema.surfaceAlt,
		alignItems: "center",
		justifyContent: "center",
	},
	cartaoTextos: {
		flex: 1,
		gap: 4,
	},
	cartaoTitulo: {
		color: tema.textoPrimario,
		fontSize: 16,
		fontWeight: "700",
	},
	cartaoSubtitulo: {
		color: tema.textoSecundario,
		fontSize: 13,
	},
});
