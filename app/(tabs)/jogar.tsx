import { MaterialCommunityIcons } from "@expo/vector-icons";
import Chessboard from "react-native-chessboard";
import { useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import tema from "@/src/constantes/tema";

type Jogador = {
	nome: string;
	rating: number;
	tempoRestante: string;
	vezDele: boolean;
};

const oponente: Jogador = {
	nome: "V. Anand",
	rating: 2750,
	tempoRestante: "05:00",
	vezDele: false,
};

const jogador: Jogador = {
	nome: "G. Kasparov",
	rating: 2812,
	tempoRestante: "04:32",
	vezDele: true,
};

type Lance = {
	numero: number;
	brancas: string;
	pretas?: string;
};

const lances: Lance[] = [
	{ numero: 1, brancas: "e4", pretas: "e5" },
	{ numero: 2, brancas: "Nf3", pretas: "Nc6" },
	{ numero: 3, brancas: "Bb5", pretas: "a6" },
	{ numero: 4, brancas: "Ba4" },
];

function CartaoJogador({
	jogador,
	invertido = false,
}: {
	jogador: Jogador;
	invertido?: boolean;
}) {
	return (
		<View style={[estilos.cartaoJogador, invertido && estilos.cartaoInvertido]}>
			<View style={estilos.avatarWrapper}>
				<MaterialCommunityIcons
					name="account"
					size={36}
					color={tema.textoSecundario}
				/>
			</View>
			<View style={estilos.cartaoInfo}>
				<Text style={estilos.nomeJogador}>{jogador.nome}</Text>
				<Text style={estilos.ratingJogador}>RATING {jogador.rating}</Text>
			</View>
			<View
				style={[estilos.cronometro, jogador.vezDele && estilos.cronometroAtivo]}
			>
				<Text
					style={[
						estilos.cronometroTexto,
						jogador.vezDele && estilos.cronometroTextoAtivo,
					]}
				>
					{jogador.tempoRestante}
				</Text>
			</View>
		</View>
	);
}

function LinhaLance({ lance }: { lance: Lance }) {
	const ultimo = !lance.pretas;
	return (
		<View style={estilos.linhaLance}>
			<Text style={estilos.numeroLance}>{lance.numero}.</Text>
			<View style={[estilos.celulasLance, ultimo && estilos.celulaAtiva]}>
				<Text style={[estilos.textoLance, ultimo && estilos.textoLanceAtivo]}>
					{lance.brancas}
				</Text>
			</View>
			<View style={estilos.celulasLance}>
				{lance.pretas ? (
					<Text style={estilos.textoLance}>{lance.pretas}</Text>
				) : (
					<Text style={estilos.textoLancePensando}>Pensando...</Text>
				)}
			</View>
		</View>
	);
}

export default function TelaJogar() {
	const { width } = useWindowDimensions();
	const tamTabuleiro = width - 32;
	const [modalDesistir, setModalDesistir] = useState(false);

	return (
		<View style={estilos.root}>
			<CartaoJogador jogador={oponente} />

			<View style={estilos.tabuleiroContainer}>
				<Chessboard
					boardSize={tamTabuleiro}
					colors={{
						black: tema.textoMudo,
						white: tema.textoPrimario,
						lastMoveHighlight: "rgba(74, 222, 128, 0.3)",
					}}
				/>
			</View>

			<CartaoJogador jogador={jogador} invertido />

			<View style={estilos.acoesContainer}>
				<Pressable style={estilos.botaoAcao}>
					<MaterialCommunityIcons
						name="handshake"
						size={22}
						color={tema.textoSecundario}
					/>
					<Text style={estilos.botaoAcaoTexto}>Empate</Text>
				</Pressable>
				<Pressable
					style={[estilos.botaoAcao, estilos.botaoDesistir]}
					onPress={() => setModalDesistir(true)}
				>
					<MaterialCommunityIcons name="flag" size={22} color="#ef4444" />
					<Text style={[estilos.botaoAcaoTexto, { color: "#ef4444" }]}>
						Desistir
					</Text>
				</Pressable>
			</View>

			{/* histórico de lances */}
			<View style={estilos.historicoContainer}>
				<View style={estilos.historicoHeader}>
					<Text style={estilos.historicoTitulo}>Histórico de Lances</Text>
					<View style={estilos.liveBadge}>
						<Text style={estilos.liveTexto}>LIVE</Text>
					</View>
				</View>
				<ScrollView showsVerticalScrollIndicator={false}>
					{lances.map((lance) => (
						<LinhaLance key={lance.numero} lance={lance} />
					))}
				</ScrollView>
			</View>

			{modalDesistir && (
				<View style={estilos.modalOverlay}>
					<View style={estilos.modal}>
						<Text style={estilos.modalTitulo}>Desistir da partida?</Text>
						<Text style={estilos.modalSubtitulo}>
							Você perderá pontos de rating.
						</Text>
						<View style={estilos.modalBotoes}>
							<Pressable
								style={[estilos.modalBotao, estilos.modalBotaoCancelar]}
								onPress={() => setModalDesistir(false)}
							>
								<Text style={estilos.modalBotaoTexto}>Cancelar</Text>
							</Pressable>
							<Pressable
								style={[estilos.modalBotao, estilos.modalBotaoConfirmar]}
								onPress={() => setModalDesistir(false)}
							>
								<Text style={[estilos.modalBotaoTexto, { color: "#ef4444" }]}>
									Desistir
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},

	// cartão jogador
	cartaoJogador: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
		gap: 12,
		backgroundColor: tema.surface,
		borderBottomWidth: 1,
		borderBottomColor: tema.borda,
	},
	cartaoInvertido: {
		borderBottomWidth: 0,
		borderTopWidth: 1,
		borderTopColor: tema.borda,
	},
	avatarWrapper: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: tema.surfaceAlt,
		alignItems: "center",
		justifyContent: "center",
	},
	cartaoInfo: {
		flex: 1,
		gap: 2,
	},
	nomeJogador: {
		color: tema.textoPrimario,
		fontSize: 15,
		fontWeight: "600",
	},
	ratingJogador: {
		color: tema.textoSecundario,
		fontSize: 11,
		letterSpacing: 1,
	},
	cronometro: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: tema.surfaceAlt,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	cronometroAtivo: {
		backgroundColor: tema.verde,
		borderColor: tema.verde,
	},
	cronometroTexto: {
		color: tema.textoPrimario,
		fontSize: 16,
		fontWeight: "700",
		fontVariant: ["tabular-nums"],
	},
	cronometroTextoAtivo: {
		color: "#0d1117",
	},

	tabuleiroContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},

	acoesContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 12,
	},
	botaoAcao: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 12,
		borderRadius: 10,
		backgroundColor: tema.surface,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	botaoDesistir: {
		borderColor: "#ef444440",
	},
	botaoAcaoTexto: {
		color: tema.textoSecundario,
		fontSize: 14,
		fontWeight: "600",
	},

	historicoContainer: {
		flex: 1,
		marginHorizontal: 16,
		marginBottom: 8,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		padding: 12,
	},
	historicoHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	historicoTitulo: {
		color: tema.textoPrimario,
		fontSize: 14,
		fontWeight: "700",
	},
	liveBadge: {
		backgroundColor: "#ef4444",
		borderRadius: 4,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	liveTexto: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 1,
	},
	linhaLance: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderBottomColor: tema.borda,
		gap: 8,
	},
	numeroLance: {
		color: tema.textoMudo,
		fontSize: 13,
		width: 24,
	},
	celulasLance: {
		flex: 1,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	celulaAtiva: {
		backgroundColor: tema.verde,
	},
	textoLance: {
		color: tema.textoPrimario,
		fontSize: 14,
		fontWeight: "500",
	},
	textoLanceAtivo: {
		color: "#0d1117",
		fontWeight: "700",
	},
	textoLancePensando: {
		color: tema.textoMudo,
		fontSize: 14,
		fontStyle: "italic",
	},

	modalOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.7)",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 100,
	},
	modal: {
		width: "80%",
		backgroundColor: tema.surface,
		borderRadius: 16,
		padding: 24,
		borderWidth: 1,
		borderColor: tema.borda,
		gap: 8,
	},
	modalTitulo: {
		color: tema.textoPrimario,
		fontSize: 18,
		fontWeight: "700",
	},
	modalSubtitulo: {
		color: tema.textoSecundario,
		fontSize: 14,
		marginBottom: 8,
	},
	modalBotoes: {
		flexDirection: "row",
		gap: 12,
	},
	modalBotao: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		borderWidth: 1,
	},
	modalBotaoCancelar: {
		backgroundColor: tema.surfaceAlt,
		borderColor: tema.borda,
	},
	modalBotaoConfirmar: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderColor: "#ef444440",
	},
	modalBotaoTexto: {
		color: tema.textoPrimario,
		fontSize: 14,
		fontWeight: "600",
	},
});
