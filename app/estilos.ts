import { StyleSheet } from "react-native";
import tema from "../src/constantes/tema";

export default StyleSheet.create({
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
