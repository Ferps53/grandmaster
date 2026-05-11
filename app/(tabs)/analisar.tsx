import { MaterialCommunityIcons } from "@expo/vector-icons";
import Chessboard from "react-native-chessboard";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import tema from "@/src/constantes/tema";
import { Chess } from "chess.js";
import { useState, useMemo } from "react";

type Jogador = {
	nome: string;
	rating: number;
};

const oponente: Jogador = { nome: "V. Anand", rating: 2750 };
const jogador: Jogador = { nome: "G. Kasparov", rating: 2812 };

type AnotacaoLance =
	| "brilhante"
	| "bom"
	| "imprecisao"
	| "erro"
	| "erro_critico"
	| null;

type Lance = {
	numero: number;
	brancas: string;
	anotacaoBrancas?: AnotacaoLance;
	pretas?: string;
	anotacaoPretas?: AnotacaoLance;
};

const lances: Lance[] = [
	{
		numero: 1,
		brancas: "e4",
		anotacaoBrancas: "bom",
		pretas: "e5",
		anotacaoPretas: "bom",
	},
	{
		numero: 2,
		brancas: "Nf3",
		anotacaoBrancas: "bom",
		pretas: "Nc6",
		anotacaoPretas: "bom",
	},
	{
		numero: 3,
		brancas: "Bb5",
		anotacaoBrancas: "bom",
		pretas: "a6",
		anotacaoPretas: "bom",
	},
	{ numero: 4, brancas: "Ba4", anotacaoBrancas: "bom" },
];

function fenParaLance(lances: Lance[], indice: number): string {
	const chess = new Chess();
	for (let i = 0; i <= indice; i++) {
		const lance = lances[i];
		chess.move(lance.brancas);
		if (lance.pretas && i < indice) {
			chess.move(lance.pretas);
		} else if (lance.pretas && i === indice) {
			chess.move(lance.pretas);
		}
	}
	return chess.fen();
}

// vantagem por lance para o gráfico (positivo = brancas, negativo = pretas)
const vantagens = [0.2, 0.3, 0.1, 0.4, 0.8, 1.2, 2.4];

function iconeAnotacao(anotacao: AnotacaoLance): string {
	switch (anotacao) {
		case "brilhante":
			return "star";
		case "bom":
			return "check-circle";
		case "imprecisao":
			return "alert-circle";
		case "erro":
			return "close-circle";
		case "erro_critico":
			return "skull";
		default:
			return "";
	}
}

function corAnotacao(anotacao: AnotacaoLance): string {
	switch (anotacao) {
		case "brilhante":
			return "#a855f7";
		case "bom":
			return tema.verde;
		case "imprecisao":
			return "#f59e0b";
		case "erro":
			return "#ef4444";
		case "erro_critico":
			return "#dc2626";
		default:
			return tema.textoMudo;
	}
}

function CartaoJogador({ jogador }: { jogador: Jogador }) {
	return (
		<View style={estilos.cartaoJogador}>
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
		</View>
	);
}

function BarraAvaliacao({ vantagem }: { vantagem: number }) {
	// vantagem em pawns, positivo = brancas
	const clampada = Math.max(-5, Math.min(5, vantagem));
	const percentualBrancas = ((clampada + 5) / 10) * 100;

	return (
		<View style={estilos.barraAvaliacao}>
			<View style={[estilos.barraPretas, { flex: 100 - percentualBrancas }]} />
			<View style={[estilos.barraBrancas, { flex: percentualBrancas }]} />
			<Text style={estilos.barraTexto}>
				{vantagem > 0 ? `+${vantagem.toFixed(1)}` : vantagem.toFixed(1)}
			</Text>
		</View>
	);
}

function GraficoVantagem({ dados }: { dados: number[] }) {
	const max = 3;
	return (
		<View style={estilos.grafico}>
			<View style={estilos.graficoBarras}>
				{dados.map((v, i) => {
					const altura = Math.abs(v) / max;
					const positivo = v >= 0;
					return (
						<View key={i} style={estilos.graficoColuna}>
							<View style={estilos.graficoCelulaTop}>
								{positivo && (
									<View
										style={[
											estilos.graficoBarra,
											{
												height: `${altura * 100}%`,
												backgroundColor: tema.verde,
											},
										]}
									/>
								)}
							</View>
							<View style={estilos.graficoCelulaBottom}>
								{!positivo && (
									<View
										style={[
											estilos.graficoBarra,
											{
												height: `${altura * 100}%`,
												backgroundColor: tema.surfaceAlt,
											},
										]}
									/>
								)}
							</View>
						</View>
					);
				})}
			</View>
			<View style={estilos.graficoLinha} />
			<View style={estilos.graficoLegenda}>
				<Text style={estilos.graficoLegendaTexto}>Lance 1</Text>
				<Text style={estilos.graficoLegendaTexto}>Lance {dados.length}</Text>
			</View>
		</View>
	);
}

function LinhaLance({
	lance,
	selecionado,
	onPress,
}: {
	lance: Lance;
	selecionado: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			style={[estilos.linhaLance, selecionado && estilos.linhaLanceSelecionada]}
			onPress={onPress}
		>
			<Text style={estilos.numeroLance}>{lance.numero}.</Text>

			<View style={[estilos.celulasLance, selecionado && estilos.celulaAtiva]}>
				<Text
					style={[estilos.textoLance, selecionado && estilos.textoLanceAtivo]}
				>
					{lance.brancas}
				</Text>
				{lance.anotacaoBrancas && (
					<MaterialCommunityIcons
						name={iconeAnotacao(lance.anotacaoBrancas) as any}
						size={12}
						color={corAnotacao(lance.anotacaoBrancas)}
					/>
				)}
			</View>

			<View style={estilos.celulasLance}>
				{lance.pretas && (
					<>
						<Text style={estilos.textoLance}>{lance.pretas}</Text>
						{lance.anotacaoPretas && (
							<MaterialCommunityIcons
								name={iconeAnotacao(lance.anotacaoPretas) as any}
								size={12}
								color={corAnotacao(lance.anotacaoPretas)}
							/>
						)}
					</>
				)}
			</View>
		</Pressable>
	);
}

export default function TelaAnalisar() {
	const [lanceSelecionado, setLanceSelecionado] = useState(lances.length - 1);
	const fen = useMemo(
		() => fenParaLance(lances, lanceSelecionado),
		[lanceSelecionado],
	);
	const { width } = useWindowDimensions();
	const tamTabuleiro = width - 64;
	const vantagem = 2.4;

	return (
		<ScrollView style={estilos.root} showsVerticalScrollIndicator={false}>
			<View style={estilos.tabuleiroRow}>
				<BarraAvaliacao vantagem={vantagem} />
				<View style={estilos.tabuleiroContainer}>
					<CartaoJogador jogador={oponente} />
					<Chessboard
						fen={fen}
						boardSize={tamTabuleiro}
						gestureEnabled={false}
						colors={{
							black: tema.textoMudo,
							white: tema.textoPrimario,
							lastMoveHighlight: "rgba(74, 222, 128, 0.3)",
						}}
					/>
					<CartaoJogador jogador={jogador} />
				</View>
			</View>

			<View style={estilos.secao}>
				<View style={estilos.secaoHeader}>
					<Text style={estilos.secaoTitulo}>Análise de Lances</Text>
					<View style={estilos.navegacaoLances}>
						<Pressable style={estilos.botaoNav}>
							<MaterialCommunityIcons
								name="skip-backward"
								size={18}
								color={tema.textoSecundario}
							/>
						</Pressable>
						<Pressable style={estilos.botaoNav}>
							<MaterialCommunityIcons
								name="chevron-left"
								size={18}
								color={tema.textoSecundario}
							/>
						</Pressable>
						<Pressable style={estilos.botaoNav}>
							<MaterialCommunityIcons
								name="chevron-right"
								size={18}
								color={tema.textoSecundario}
							/>
						</Pressable>
						<Pressable style={estilos.botaoNav}>
							<MaterialCommunityIcons
								name="skip-forward"
								size={18}
								color={tema.textoSecundario}
							/>
						</Pressable>
					</View>
				</View>

				{lances.map((lance, i) => (
					<LinhaLance
						key={lance.numero}
						lance={lance}
						selecionado={i === lanceSelecionado}
						onPress={() => setLanceSelecionado(i)}
					/>
				))}

				<View style={estilos.analiseEngine}>
					<Text style={estilos.analiseEngineTexto}>
						<Text style={{ color: tema.verde, fontWeight: "700" }}>
							Análise da Engine:{" "}
						</Text>
						Essa é a clássica abertura Ruy Lopéz, uma das aberturas mais jogadas
						por Magnus Carlsen. Essa abertura possuí muitas variações, por isso
						é muito utilizada por jogadores de alto nível.
					</Text>
				</View>

				<Pressable style={estilos.botaoMelhorLinha}>
					<MaterialCommunityIcons name="robot" size={18} color="#0d1117" />
					<Text style={estilos.botaoMelhorLinhaTexto}>
						Mostrar Melhor Linha
					</Text>
				</Pressable>
			</View>

			<View style={estilos.secao}>
				<View style={estilos.secaoHeader}>
					<Text style={estilos.secaoTitulo}>Vantagem no Jogo</Text>
					<View style={estilos.legendaGrafico}>
						<View
							style={[estilos.legendaPonto, { backgroundColor: tema.verde }]}
						/>
						<Text style={estilos.legendaTexto}>Brancas</Text>
						<View
							style={[
								estilos.legendaPonto,
								{ backgroundColor: tema.textoMudo },
							]}
						/>
						<Text style={estilos.legendaTexto}>Pretas</Text>
					</View>
				</View>
				<GraficoVantagem dados={vantagens} />
			</View>

			<View style={estilos.secao}>
				<Text style={estilos.secaoLabel}>PRECISÃO DA REVISÃO</Text>
				<View style={estilos.precisaoRow}>
					<Text style={estilos.precisaoNumero}>94.2%</Text>
					<View style={estilos.precisaoInfo}>
						<Text style={estilos.precisaoInfoLabel}>Desempenho</Text>
						<Text style={estilos.precisaoInfoValor}>GM 2650</Text>
					</View>
				</View>
				<View style={estilos.estatisticasRow}>
					<View style={estilos.estatistica}>
						<Text style={estilos.estatisticaValor}>2</Text>
						<Text style={estilos.estatisticaLabel}>Brilhantes</Text>
					</View>
					<View style={estilos.estatistica}>
						<Text style={estilos.estatisticaValor}>24</Text>
						<Text style={estilos.estatisticaLabel}>Melhores</Text>
					</View>
					<View style={[estilos.estatistica, estilos.estatisticaErro]}>
						<Text style={[estilos.estatisticaValor, { color: "#ef4444" }]}>
							0
						</Text>
						<Text style={estilos.estatisticaLabel}>Erros Críticos</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},

	cabecalho: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: tema.borda,
	},
	cabecalhoLabel: {
		color: tema.textoSecundario,
		fontSize: 10,
		letterSpacing: 1.5,
		marginBottom: 2,
	},
	cabecalhoLance: {
		color: tema.verde,
		fontSize: 18,
		fontWeight: "700",
	},
	badgeBrilhante: {
		backgroundColor: "#a855f720",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "#a855f740",
	},
	badgeBrilhanteTexto: {
		color: "#a855f7",
		fontSize: 12,
		fontWeight: "600",
	},

	tabuleiroRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingRight: 16,
		gap: 8,
	},
	tabuleiroContainer: {
		flex: 1,
		gap: 4,
	},

	cartaoJogador: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 4,
	},
	avatarWrapper: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: tema.surfaceAlt,
		alignItems: "center",
		justifyContent: "center",
	},
	cartaoInfo: {
		gap: 1,
	},
	nomeJogador: {
		color: tema.textoPrimario,
		fontSize: 13,
		fontWeight: "600",
	},
	ratingJogador: {
		color: tema.textoSecundario,
		fontSize: 10,
		letterSpacing: 1,
	},

	barraAvaliacao: {
		width: 20,
		alignSelf: "stretch",
		borderRadius: 10,
		overflow: "hidden",
		flexDirection: "column",
		marginLeft: 16,
		position: "relative",
	},
	barraPretas: {
		backgroundColor: tema.surfaceAlt,
	},
	barraBrancas: {
		backgroundColor: tema.textoPrimario,
	},
	barraTexto: {
		position: "absolute",
		bottom: -20,
		left: -10,
		width: 40,
		color: tema.textoSecundario,
		fontSize: 10,
		textAlign: "center",
	},

	// seções
	secao: {
		marginHorizontal: 16,
		marginTop: 16,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		padding: 14,
		gap: 8,
	},
	secaoHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	secaoTitulo: {
		color: tema.textoPrimario,
		fontSize: 14,
		fontWeight: "700",
	},
	secaoLabel: {
		color: tema.textoSecundario,
		fontSize: 10,
		letterSpacing: 1.5,
	},

	navegacaoLances: {
		flexDirection: "row",
		gap: 4,
	},
	botaoNav: {
		padding: 4,
		borderRadius: 6,
		backgroundColor: tema.surfaceAlt,
	},

	linhaLance: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderBottomColor: tema.borda,
		gap: 8,
		borderRadius: 6,
	},
	linhaLanceSelecionada: {
		backgroundColor: tema.surfaceAlt,
	},
	numeroLance: {
		color: tema.textoMudo,
		fontSize: 13,
		width: 24,
	},
	celulasLance: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		gap: 4,
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

	analiseEngine: {
		backgroundColor: tema.surfaceAlt,
		borderRadius: 8,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: tema.verde,
	},
	analiseEngineTexto: {
		color: tema.textoSecundario,
		fontSize: 13,
		lineHeight: 20,
	},

	botaoMelhorLinha: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: tema.verde,
		borderRadius: 10,
		paddingVertical: 12,
	},
	botaoMelhorLinhaTexto: {
		color: "#0d1117",
		fontSize: 14,
		fontWeight: "700",
	},

	grafico: {
		height: 120,
		position: "relative",
	},
	graficoBarras: {
		flex: 1,
		flexDirection: "row",
		alignItems: "stretch",
		gap: 4,
	},
	graficoColuna: {
		flex: 1,
		flexDirection: "column",
	},
	graficoCelulaTop: {
		flex: 1,
		justifyContent: "flex-end",
	},
	graficoCelulaBottom: {
		flex: 1,
		justifyContent: "flex-start",
	},
	graficoBarra: {
		borderRadius: 3,
		width: "100%",
	},
	graficoLinha: {
		position: "absolute",
		left: 0,
		right: 0,
		top: "50%",
		height: 1,
		backgroundColor: tema.borda,
	},
	graficoLegenda: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
	},
	graficoLegendaTexto: {
		color: tema.textoMudo,
		fontSize: 10,
	},

	legendaGrafico: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	legendaPonto: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	legendaTexto: {
		color: tema.textoSecundario,
		fontSize: 11,
	},

	precisaoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	precisaoNumero: {
		color: tema.verde,
		fontSize: 40,
		fontWeight: "700",
	},
	precisaoInfo: {
		gap: 4,
	},
	precisaoInfoLabel: {
		color: tema.textoSecundario,
		fontSize: 11,
		letterSpacing: 1,
	},
	precisaoInfoValor: {
		color: tema.textoPrimario,
		fontSize: 18,
		fontWeight: "700",
	},
	estatisticasRow: {
		flexDirection: "row",
		gap: 8,
	},
	estatistica: {
		flex: 1,
		backgroundColor: tema.surfaceAlt,
		borderRadius: 10,
		padding: 12,
		alignItems: "center",
		gap: 4,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	estatisticaErro: {
		borderColor: "#ef444440",
	},
	estatisticaValor: {
		color: tema.textoPrimario,
		fontSize: 22,
		fontWeight: "700",
	},
	estatisticaLabel: {
		color: tema.textoSecundario,
		fontSize: 11,
		textAlign: "center",
	},
});
