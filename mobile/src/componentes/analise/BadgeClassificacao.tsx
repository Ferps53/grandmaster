import { StyleSheet, Text, View } from "react-native";
import {
	type Classificacao,
	corClassificacao,
	rotuloClassificacao,
} from "@/src/util/classificacao";

type Props = {
	classificacao: Classificacao;
	tamanho?: "sm" | "md";
};

export default function BadgeClassificacao({
	classificacao,
	tamanho = "md",
}: Props) {
	const cor = corClassificacao(classificacao);
	const ehPequeno = tamanho === "sm";
	return (
		<View
			style={[
				estilos.badge,
				{ borderColor: cor, backgroundColor: `${cor}22` },
				ehPequeno && estilos.badgeSm,
			]}
		>
			<Text
				style={[estilos.texto, { color: cor }, ehPequeno && estilos.textoSm]}
			>
				{rotuloClassificacao(classificacao)}
			</Text>
		</View>
	);
}

const estilos = StyleSheet.create({
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
		borderWidth: 1,
		alignSelf: "flex-start",
	},
	badgeSm: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	texto: {
		fontSize: 12,
		fontWeight: "700",
	},
	textoSm: {
		fontSize: 10,
	},
});
