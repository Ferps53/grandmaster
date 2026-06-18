import { StyleSheet, Text, View } from "react-native";
import tema from "@/src/constantes/tema";

type Props = {
	avaliacao: number;
	mate?: number;
	largura: number;
};

const LIMITE = 8;

export default function BarraAvaliacao({ avaliacao, mate, largura }: Props) {
	let proporcaoBrancas: number;
	let rotulo: string;

	if (mate !== undefined && mate !== 0) {
		proporcaoBrancas = mate > 0 ? 1 : 0;
		rotulo = `M${Math.abs(mate)}`;
	} else {
		const clamp = Math.max(-LIMITE, Math.min(LIMITE, avaliacao));
		proporcaoBrancas = 0.5 + clamp / (LIMITE * 2);
		const sinal = avaliacao > 0 ? "+" : "";
		rotulo = `${sinal}${avaliacao.toFixed(1)}`;
	}

	const larguraBrancas = largura * proporcaoBrancas;
	const textoNaEsquerda = proporcaoBrancas >= 0.5;

	return (
		<View style={[estilos.container, { width: largura }]}>
			<View style={[estilos.brancas, { width: larguraBrancas }]}>
				{textoNaEsquerda && <Text style={estilos.textoPreto}>{rotulo}</Text>}
			</View>
			<View style={estilos.pretas}>
				{!textoNaEsquerda && <Text style={estilos.textoBranco}>{rotulo}</Text>}
			</View>
		</View>
	);
}

const estilos = StyleSheet.create({
	container: {
		height: 22,
		flexDirection: "row",
		borderRadius: 4,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: tema.borda,
	},
	brancas: {
		backgroundColor: tema.textoPrimario,
		justifyContent: "center",
		paddingLeft: 6,
	},
	pretas: {
		flex: 1,
		backgroundColor: "#0d1117",
		justifyContent: "center",
		alignItems: "flex-end",
		paddingRight: 6,
	},
	textoPreto: {
		color: "#0d1117",
		fontSize: 11,
		fontWeight: "700",
	},
	textoBranco: {
		color: tema.textoPrimario,
		fontSize: 11,
		fontWeight: "700",
	},
});
