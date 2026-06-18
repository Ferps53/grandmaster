import { Chess } from "chess.js";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import tema from "@/src/constantes/tema";

type Props = {
	fen: string;
	continuacao: string[];
	maxLances?: number;
	carregando?: boolean;
};

function uciParaSan(fen: string, lances: string[], max: number): string[] {
	const chess = new Chess();
	try {
		chess.load(fen);
	} catch {
		return [];
	}
	const sans: string[] = [];
	for (const uci of lances.slice(0, max)) {
		const from = uci.slice(0, 2);
		const to = uci.slice(2, 4);
		const promotion = uci.length > 4 ? uci.slice(4, 5) : undefined;
		try {
			const m = chess.move({ from, to, promotion });
			if (!m) break;
			sans.push(m.san);
		} catch {
			break;
		}
	}
	return sans;
}

export default function BarraSugestoes({
	fen,
	continuacao,
	maxLances = 8,
	carregando = false,
}: Props) {
	const sans = useMemo(
		() => uciParaSan(fen, continuacao, maxLances),
		[fen, continuacao, maxLances],
	);

	const turnoBrancas = fen.split(" ")[1] === "w";
	let numeroInicial = parseInt(fen.split(" ")[5] ?? "1", 10);
	if (Number.isNaN(numeroInicial)) numeroInicial = 1;

	return (
		<View style={estilos.container}>
			<Text style={estilos.titulo}>Linha sugerida</Text>
			{sans.length === 0 ? (
				<Text style={estilos.vazio}>
					{carregando ? "Calculando..." : "Sem sugestão disponível"}
				</Text>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={estilos.linha}
				>
					{sans.map((san, i) => {
						const brancasJogam = turnoBrancas ? i % 2 === 0 : i % 2 === 1;
						const numero =
							numeroInicial + Math.floor((turnoBrancas ? i : i + 1) / 2);
						const rotulo = brancasJogam
							? `${numero}. ${san}`
							: `${numero}... ${san}`;
						return (
							<View
								key={`${san}-${i}`}
								style={[estilos.chip, i === 0 && estilos.chipDestaque]}
							>
								<Text
									style={[
										estilos.chipTexto,
										i === 0 && estilos.chipTextoDestaque,
									]}
								>
									{rotulo}
								</Text>
							</View>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
}

const estilos = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginTop: 10,
		padding: 12,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		gap: 8,
	},
	titulo: {
		color: tema.textoSecundario,
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 1.2,
	},
	vazio: {
		color: tema.textoMudo,
		fontSize: 12,
	},
	linha: {
		flexDirection: "row",
		gap: 8,
		paddingRight: 8,
	},
	chip: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: tema.surfaceAlt,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	chipDestaque: {
		backgroundColor: tema.verde,
		borderColor: tema.verde,
	},
	chipTexto: {
		color: tema.textoPrimario,
		fontSize: 13,
		fontWeight: "600",
	},
	chipTextoDestaque: {
		color: "#0d1117",
		fontWeight: "700",
	},
});
