import NoAtual from "@/src/componentes/aprender/NoAtual";
import NoBloqueado from "@/src/componentes/aprender/NoBloqueado";
import NoConcluido from "@/src/componentes/aprender/NoConcluido";
import tema from "@/src/constantes/tema";
import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import type { Licao } from "@/src/model/Licao";
import servicoAPI, { type LicaoListaAPI } from "@/src/servicos/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

function mapearLicoes(lista: LicaoListaAPI[]): Licao[] {
	return lista.map((l, indice) => ({
		id: l.id,
		titulo: l.titulo,
		icone: l.icone as Licao["icone"],
		status: l.status,
		offset: indice % 2 === 0 ? 60 : -60,
	}));
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
	const { token } = useAutenticacao();
	const [licoes, setLicoes] = useState<Licao[]>([]);
	const [carregando, setCarregando] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		if (!token) return;
		try {
			setErro(null);
			const lista = await servicoAPI.listarLicoes(token);
			setLicoes(mapearLicoes(lista));
		} catch (err) {
			setErro(err instanceof Error ? err.message : "Erro ao carregar lições");
		} finally {
			setCarregando(false);
		}
	}, [token]);

	useFocusEffect(
		useCallback(() => {
			void carregar();
		}, [carregar]),
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
			{carregando ? (
				<View style={estilos.centro}>
					<ActivityIndicator color={tema.verde} />
				</View>
			) : erro ? (
				<View style={estilos.centro}>
					<Text style={estilos.erroTexto}>{erro}</Text>
				</View>
			) : (
				<ScrollView
					style={estilos.root}
					contentContainerStyle={estilos.conteudo}
					showsVerticalScrollIndicator={false}
				>
					{licoes.map((licao) => renderNo(licao))}
				</ScrollView>
			)}
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
	centro: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	erroTexto: {
		color: tema.vermelho,
		textAlign: "center",
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
