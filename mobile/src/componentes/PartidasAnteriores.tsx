import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import tema from "../constantes/tema";
import type { PropsParidasAnteriores } from "../model/PartidasAnteriores";

export default function PartidasAnteriores({
	nome,
	elo,
	status,
	ativo = false,
	detalhes = "BLITZ • 3M + 2S",
	eloGanho = "+12",
}: PropsParidasAnteriores) {
	function getStatus(s: "V" | "E" | "D"): string {
		switch (s) {
			case "V":
				return "Vitória";
			case "E":
				return "Empate";
			case "D":
				return "Derrota";
		}
	}

	function getStatusColor(s: "V" | "E" | "D"): string {
		switch (s) {
			case "V":
				return tema.verde;
			case "E":
				return tema.textoSecundario;
			case "D":
				return tema.vermelho;
		}
	}

	return (
		<View
			style={[estilo.itemPartida, { borderLeftColor: getStatusColor(status) }]}
		>
			<View style={estilo.avatarOponente}>
				<MaterialCommunityIcons
					name="account"
					size={24}
					color={tema.textoMudo}
				/>

				{ativo && <View style={estilo.indicadorAtivo} />}
			</View>

			<View style={{ flex: 1, marginLeft: 12 }}>
				<Text style={estilo.nomeOponente}>{nome}</Text>
				<Text style={estilo.detalhePartida}>{detalhes}</Text>
			</View>

			<View style={{ alignItems: "flex-end" }}>
				<Text
					style={[estilo.resultadoPartida, { color: getStatusColor(status) }]}
				>
					{getStatus(status)}
				</Text>
				<Text style={estilo.eloGanho}>{eloGanho} Elo</Text>
			</View>
		</View>
	);
}

const estilo = StyleSheet.create({
	itemPartida: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: tema.surfaceAlt,
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		borderLeftWidth: 4,
		marginHorizontal: 20,
	},
	avatarOponente: {
		width: 40,
		height: 40,
		backgroundColor: "#2a2f3e",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	indicadorAtivo: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: tema.verde,
		position: "absolute",
		bottom: -2,
		right: -2,
		borderWidth: 2,
		borderColor: "#2a2f3e",
	},
	nomeOponente: {
		color: tema.textoPrimario,
		fontWeight: "bold",
		fontSize: 16,
	},
	detalhePartida: {
		color: tema.textoMudo,
		fontSize: 12,
	},
	resultadoPartida: {
		fontWeight: "bold",
		fontSize: 16,
	},
	eloGanho: {
		color: tema.textoMudo,
		fontSize: 12,
	},
});
