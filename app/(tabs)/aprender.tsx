import NoAtual from "@/src/componentes/aprender/NoAtual";
import NoBloqueado from "@/src/componentes/aprender/NoBloqueado";
import NoConcluido from "@/src/componentes/aprender/NoConcluido";
import tema from "@/src/constantes/tema";
import type { Licao } from "@/src/model/Licao";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const CHAVE_PROGRESSO_LICOES = "licoes_concluidas";

const LICOES_BASE: Omit<Licao, "status">[] = [
	{
		id: "1",
		titulo: "Fundamentos",
		icone: "medal",
		offset: 60,
	},
	{
		id: "2",
		titulo: "Abertura",
		icone: "chess-pawn",
		offset: -60,
	},
	{
		id: "3",
		titulo: "Tática de Garfo",
		icone: "head-cog",
		offset: 60,
	},
	{
		id: "4",
		titulo: "Finais Básicos",
		icone: "chess-king",
		offset: -60,
	},
	{
		id: "5",
		titulo: "Desafio do Mestre",
		icone: "gift",
		offset: 60,
	},
	{
		id: "6",
		titulo: "Xeque-mate em 1",
		icone: "chess-queen",
		offset: -60,
	},

	{
		id: "7",
		titulo: "Xeque-mate em 2",
		icone: "chess-queen",
		offset: 60,
	},

	{
		id: "8",
		titulo: "Defesa contra o mate do pastor",
		icone: "chess-bishop",
		offset: -60,
	},
];

function montarLicoes(completas: Set<string>): Licao[] {
	const indiceAtual = LICOES_BASE.findIndex((licao) => !completas.has(licao.id));

	return LICOES_BASE.map((licao, indice) => {
		let status: Licao["status"] = "bloqueada";

		if (completas.has(licao.id)) {
			status = "concluida";
		} else if (indiceAtual !== -1 && indice === indiceAtual) {
			status = "atual";
		}

		return { ...licao, status };
	});
}

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
	const [licoes, setLicoes] = useState<Licao[]>(montarLicoes(new Set()));

	const carregarProgresso = useCallback(async () => {
		try {
			const dados = await AsyncStorage.getItem(CHAVE_PROGRESSO_LICOES);
			const completas = new Set<string>(
				dados ? (JSON.parse(dados) as string[]) : [],
			);
			setLicoes(montarLicoes(completas));
		} catch {
			setLicoes(montarLicoes(new Set()));
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			void carregarProgresso();
		}, [carregarProgresso]),
	);

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
