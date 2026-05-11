import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NoAtual from "@/src/componentes/aprender/NoAtual";
import NoBloqueado from "@/src/componentes/aprender/NoBloqueado";
import NoConcluido from "@/src/componentes/aprender/NoConcluido";
import tema from "@/src/constantes/tema";
import type { Licao } from "@/src/model/Licao";

const licoes: Licao[] = [
	{
		id: "1",
		titulo: "Fundamentos",
		status: "concluida",
		icone: "medal",
		offset: 60,
	},
	{
		id: "2",
		titulo: "Baú de Táticas",
		status: "concluida",
		icone: "gift",
		offset: -60,
	},
	{
		id: "3",
		titulo: "Tática de Garfo",
		status: "atual",
		icone: "head-cog",
		offset: 60,
	},
	{
		id: "4",
		titulo: "Finais Básicos",
		status: "bloqueada",
		icone: "chess-king",
		offset: -60,
	},
	{
		id: "5",
		titulo: "Desafio do Mestre",
		status: "bloqueada",
		icone: "gift",
		offset: 60,
	},
	{
		id: "6",
		titulo: "Xeque-mate em 1",
		status: "bloqueada",
		icone: "chess-queen",
		offset: -60,
	},

	{
		id: "7",
		titulo: "Xeque-mate em 2",
		status: "bloqueada",
		icone: "chess-queen",
		offset: 60,
	},

	{
		id: "8",
		titulo: "Defesa contra o mate do pastor",
		status: "bloqueada",
		icone: "chess-bishop",
		offset: -60,
	},
];

function renderNo(licao: Licao) {
	switch (licao.status) {
		case "concluida":
			return <NoConcluido key={licao.id} {...licao} />;
		case "atual":
			return <NoAtual key={licao.id} {...licao} />;
		case "bloqueada":
			return <NoBloqueado key={licao.id} {...licao} />;
	}
}

export default function TelaAprender() {
	return (
		<View style={estilos.root}>
			<View style={estilos.xpContainer}>
				<MaterialCommunityIcons
					name="star-four-points"
					size={14}
					color="#0d1117"
				/>
				<Text style={estilos.xpTexto}>1250 XP</Text>
			</View>
			<ScrollView
				style={estilos.root}
				contentContainerStyle={estilos.conteudo}
				showsVerticalScrollIndicator={false}
			>
				{licoes.map((licao, _) => renderNo(licao))}
			</ScrollView>
		</View>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},
	conteudo: {
		paddingVertical: 24,
		paddingBottom: 80,
	},
	xpContainer: {
		position: "absolute",
		top: 16,
		right: 24,
		zIndex: 10,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: tema.verde,
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		gap: 6,
	},
	xpTexto: {
		color: "#0d1117",
		fontWeight: "700",
		fontSize: 14,
	},
});
