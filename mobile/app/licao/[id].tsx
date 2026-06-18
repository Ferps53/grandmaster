import tema from "@/src/constantes/tema";
import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import type { ConteudoLicao, PassoLicao } from "@/src/model/ConteudoLicao";
import servicoAPI from "@/src/servicos/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import type { ChessboardRef } from "react-native-chessboard";
import Chessboard from "react-native-chessboard";

type EstadoJogada = "aguardando" | "correto" | "errado" | "computador";

export default function TelaLicao() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { token } = useAutenticacao();
	const { width } = useWindowDimensions();
	const tamTabuleiro = width - 32;

	const [licao, setLicao] = useState<ConteudoLicao | null>(null);
	const [carregandoLicao, setCarregandoLicao] = useState(true);
	const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

	const [indicePasso, setIndicePasso] = useState(0);
	const [estado, setEstado] = useState<EstadoJogada>("aguardando");
	const [concluida, setConcluida] = useState(false);
	const [tentativas, setTentativas] = useState(0);
	const boardRef = useRef<ChessboardRef>(null);

	const passo: PassoLicao | undefined = licao?.passos[indicePasso];

	useEffect(() => {
		if (!id || !token) return;
		let cancelado = false;
		setCarregandoLicao(true);
		setErroCarregamento(null);
		servicoAPI
			.buscarLicao(token, id)
			.then((dados) => {
				if (!cancelado) setLicao(dados);
			})
			.catch((err) => {
				if (!cancelado)
					setErroCarregamento(
						err instanceof Error ? err.message : "Erro ao carregar lição",
					);
			})
			.finally(() => {
				if (!cancelado) setCarregandoLicao(false);
			});
		return () => {
			cancelado = true;
		};
	}, [id, token]);

	const aplicarDestaquesEFen = useCallback(async (p: PassoLicao) => {
		await boardRef.current?.resetBoard(p.fen);
		// pequeno delay para o board processar o reset
		await new Promise((r) => setTimeout(r, 150));
		boardRef.current?.resetAllHighlightedSquares();
		if (p.destaques) {
			for (const d of p.destaques) {
				boardRef.current?.highlight({ square: d.square, color: d.color });
			}
		}
	}, []);

	// carrega o passo atual no tabuleiro
	useEffect(() => {
		if (!passo) return;
		setEstado("aguardando");
		setTentativas(0);
		aplicarDestaquesEFen(passo);
	}, [passo, aplicarDestaquesEFen]);

	const avancarPasso = useCallback(async () => {
		const proximo = indicePasso + 1;
		if (proximo >= (licao?.passos.length ?? 0)) {
			setConcluida(true);
		} else {
			setIndicePasso(proximo);
		}
	}, [indicePasso, licao]);

	const executarRespostaComputador = useCallback(
		async (p: PassoLicao) => {
			if (!p.respostaComputador) return;
			setEstado("computador");
			await new Promise((r) => setTimeout(r, 800));
			await boardRef.current?.move(p.respostaComputador);
			await new Promise((r) => setTimeout(r, 600));
			await avancarPasso();
		},
		[avancarPasso],
	);

	const aoMover = useCallback(
		async ({ move }: { move: { from: string; to: string } }) => {
			if (!passo || estado !== "aguardando") return;

			const correto =
				move.from === passo.movimentoEsperado.from &&
				move.to === passo.movimentoEsperado.to;

			if (correto) {
				setEstado("correto");
				if (passo.respostaComputador) {
					await executarRespostaComputador(passo);
				} else {
					await new Promise((r) => setTimeout(r, 900));
					await avancarPasso();
				}
			} else {
				setTentativas((t) => t + 1);
				setEstado("errado");
				await new Promise((r) => setTimeout(r, 800));
				await aplicarDestaquesEFen(passo);
				setEstado("aguardando");
			}
		},
		[
			passo,
			estado,
			executarRespostaComputador,
			avancarPasso,
			aplicarDestaquesEFen,
		],
	);

	const aoContinuar = useCallback(() => {
		if (router.canGoBack()) {
			router.back();
			return;
		}
		router.replace("/(tabs)/aprender");
	}, [router]);

	const marcarLicaoConcluida = useCallback(async () => {
		if (!id || !token) return;
		try {
			await servicoAPI.concluirLicao(token, id);
		} catch {
			// Não bloqueia o fluxo da lição caso a chamada falhe.
		}
	}, [id, token]);

	useEffect(() => {
		if (!concluida) return;
		void marcarLicaoConcluida();
	}, [concluida, marcarLicaoConcluida]);

	if (carregandoLicao) {
		return (
			<View style={[estilos.root, estilos.rootConcluido]}>
				<ActivityIndicator color={tema.verde} />
			</View>
		);
	}

	if (!licao) {
		return (
			<View style={estilos.root}>
				<View style={estilos.header}>
					<Pressable style={estilos.botaoVoltar} onPress={() => router.back()}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={24}
							color={tema.textoPrimario}
						/>
					</Pressable>
					<Text style={estilos.headerTitulo}>
						{erroCarregamento ?? "Lição não encontrada"}
					</Text>
				</View>
			</View>
		);
	}

	if (concluida) {
		return (
			<View style={[estilos.root, estilos.rootConcluido]}>
				<View style={estilos.conclusaoContainer}>
					<View style={estilos.conclusaoIconeWrapper}>
						<MaterialCommunityIcons
							name="star-circle"
							size={80}
							color={tema.verde}
						/>
					</View>
					<Text style={estilos.conclusaoTitulo}>Lição Concluída!</Text>
					<Text style={estilos.conclusaoSubtitulo}>{licao.titulo}</Text>
					<Text style={estilos.conclusaoDescricao}>
						Você completou todos os {licao.passos.length} passos com sucesso!
					</Text>
					<View style={estilos.conclusaoXp}>
						<MaterialCommunityIcons
							name="star-four-points"
							size={16}
							color="#0d1117"
						/>
						<Text style={estilos.conclusaoXpTexto}>+50 XP</Text>
					</View>
					<Pressable style={estilos.botaoContinuar} onPress={aoContinuar}>
						<Text style={estilos.botaoContinuarTexto}>Continuar</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	const feedbackVisivel = estado === "correto" || estado === "errado";

	return (
		<View style={estilos.root}>
			{/* Header */}
			<View style={estilos.header}>
				<Pressable style={estilos.botaoVoltar} onPress={() => router.back()}>
					<MaterialCommunityIcons
						name="arrow-left"
						size={24}
						color={tema.textoPrimario}
					/>
				</Pressable>
				<View style={estilos.headerCentro}>
					<Text style={estilos.headerTitulo}>{licao.titulo}</Text>
					<Text style={estilos.headerSubtitulo}>
						Passo {indicePasso + 1} de {licao.passos.length}
					</Text>
				</View>
				<View style={estilos.headerEspacador} />
			</View>

			{/* Barra de progresso */}
			<View style={estilos.progressoContainer}>
				{licao.passos.map((_, i) => (
					<View
						key={String(i)}
						style={[
							estilos.progressoPonto,
							i < indicePasso && estilos.progressoPontoConcluido,
							i === indicePasso && estilos.progressoPontoAtual,
						]}
					/>
				))}
			</View>

			<ScrollView
				style={estilos.scrollRoot}
				contentContainerStyle={estilos.scrollConteudo}
				showsVerticalScrollIndicator={false}
			>
				{/* Card de instrução */}
				<View style={estilos.cardInstrucao}>
					<View style={estilos.cardIconeWrapper}>
						<MaterialCommunityIcons
							name="lightbulb-outline"
							size={20}
							color={tema.verde}
						/>
					</View>
					<Text style={estilos.instrucaoTexto}>{passo?.instrucao}</Text>
				</View>

				{/* Tabuleiro */}
				<View style={estilos.tabuleiroWrapper}>
					<Chessboard
						ref={boardRef}
						boardSize={tamTabuleiro}
						fen={passo?.fen}
						gestureEnabled={estado === "aguardando"}
						onMove={aoMover}
						colors={{
							black: tema.textoMudo,
							white: tema.textoSecundario,
							lastMoveHighlight: "rgba(74, 222, 128, 0.35)",
							checkmateHighlight: "#ef4444",
						}}
						withLetters
						withNumbers
					/>
				</View>

				{/* Feedback de jogada */}
				{feedbackVisivel && (
					<View
						style={[
							estilos.feedbackCard,
							estado === "correto"
								? estilos.feedbackCorreto
								: estilos.feedbackErrado,
						]}
					>
						<MaterialCommunityIcons
							name={estado === "correto" ? "check-circle" : "close-circle"}
							size={22}
							color={estado === "correto" ? tema.verde : tema.vermelho}
						/>
						<Text
							style={[
								estilos.feedbackTexto,
								estado === "correto"
									? estilos.feedbackTextoCorreto
									: estilos.feedbackTextoErrado,
							]}
						>
							{estado === "correto"
								? "Correto! Muito bem!"
								: "Movimento incorreto. Tente novamente!"}
						</Text>
					</View>
				)}

				{/* Dica (aparece após 2 tentativas erradas) */}
				{passo?.dica && tentativas >= 2 && estado === "aguardando" && (
					<View style={estilos.dicaCard}>
						<MaterialCommunityIcons
							name="help-circle-outline"
							size={18}
							color="#facc15"
						/>
						<Text style={estilos.dicaTexto}>{passo.dica}</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const estilos = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},
	rootConcluido: {
		justifyContent: "center",
		alignItems: "center",
	},

	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 12,
		gap: 12,
	},
	botaoVoltar: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: tema.surface,
		alignItems: "center",
		justifyContent: "center",
	},
	headerCentro: {
		flex: 1,
		alignItems: "center",
	},
	headerTitulo: {
		fontSize: 18,
		fontWeight: "700",
		color: tema.textoPrimario,
	},
	headerSubtitulo: {
		fontSize: 12,
		color: tema.textoSecundario,
		marginTop: 2,
	},
	headerEspacador: {
		width: 40,
	},

	// Progresso
	progressoContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 6,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	progressoPonto: {
		height: 6,
		flex: 1,
		borderRadius: 3,
		backgroundColor: tema.surfaceAlt,
	},
	progressoPontoConcluido: {
		backgroundColor: tema.verde,
	},
	progressoPontoAtual: {
		backgroundColor: tema.verde,
		opacity: 0.5,
	},

	// Scroll
	scrollRoot: {
		flex: 1,
	},
	scrollConteudo: {
		paddingHorizontal: 16,
		paddingBottom: 32,
		gap: 16,
	},

	// Card instrução
	cardInstrucao: {
		backgroundColor: tema.surface,
		borderRadius: 16,
		padding: 16,
		flexDirection: "row",
		gap: 12,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	cardIconeWrapper: {
		marginTop: 2,
	},
	instrucaoTexto: {
		flex: 1,
		color: tema.textoPrimario,
		fontSize: 15,
		lineHeight: 22,
	},

	// Tabuleiro
	tabuleiroWrapper: {
		borderRadius: 12,
		overflow: "hidden",
	},

	// Feedback
	feedbackCard: {
		borderRadius: 12,
		padding: 14,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderWidth: 1,
	},
	feedbackCorreto: {
		backgroundColor: "rgba(74,222,128,0.1)",
		borderColor: "rgba(74,222,128,0.3)",
	},
	feedbackErrado: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderColor: "rgba(239,68,68,0.3)",
	},
	feedbackTexto: {
		fontSize: 15,
		fontWeight: "600",
	},
	feedbackTextoCorreto: {
		color: tema.verde,
	},
	feedbackTextoErrado: {
		color: tema.vermelho,
	},

	// Dica
	dicaCard: {
		backgroundColor: "rgba(250,204,21,0.08)",
		borderRadius: 12,
		padding: 12,
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 8,
		borderWidth: 1,
		borderColor: "rgba(250,204,21,0.25)",
	},
	dicaTexto: {
		flex: 1,
		color: "#facc15",
		fontSize: 13,
		lineHeight: 20,
	},

	// Conclusão
	conclusaoContainer: {
		alignItems: "center",
		paddingHorizontal: 32,
		gap: 16,
	},
	conclusaoIconeWrapper: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(74,222,128,0.1)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	conclusaoTitulo: {
		fontSize: 28,
		fontWeight: "800",
		color: tema.textoPrimario,
		textAlign: "center",
	},
	conclusaoSubtitulo: {
		fontSize: 16,
		color: tema.verde,
		fontWeight: "600",
		textAlign: "center",
	},
	conclusaoDescricao: {
		fontSize: 14,
		color: tema.textoSecundario,
		textAlign: "center",
		lineHeight: 22,
	},
	conclusaoXp: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: tema.verde,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		marginTop: 8,
	},
	conclusaoXpTexto: {
		color: "#0d1117",
		fontWeight: "800",
		fontSize: 16,
	},
	botaoContinuar: {
		backgroundColor: tema.verde,
		borderRadius: 14,
		paddingVertical: 16,
		paddingHorizontal: 48,
		marginTop: 8,
	},
	botaoContinuarTexto: {
		color: "#0d1117",
		fontWeight: "800",
		fontSize: 17,
	},
});
