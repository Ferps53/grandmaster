import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Chess } from "chess.js";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import Chessboard, { type ChessboardRef } from "react-native-chessboard";
import type { Move } from "chess.js";
import BadgeClassificacao from "@/src/componentes/analise/BadgeClassificacao";
import BarraAvaliacao from "@/src/componentes/analise/BarraAvaliacao";
import BarraSugestoes from "@/src/componentes/analise/BarraSugestoes";
import tema, { coresTabuleiro } from "@/src/constantes/tema";
import type { AnaliseChessApi, ModoAnalise } from "@/src/model/Analise";
import { analisarPosicao } from "@/src/servicos/chessApi";
import {
	type AvaliacaoLance,
	type Classificacao,
	classificarLance,
	corClassificacao,
} from "@/src/util/classificacao";

const FEN_INICIAL = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function rotuloVantagem(avaliacao: number, mate?: number): string {
	if (mate !== undefined && mate !== 0) {
		return mate > 0 ? "Mate para as brancas" : "Mate para as pretas";
	}
	if (avaliacao > 0.5) return "Brancas têm vantagem";
	if (avaliacao < -0.5) return "Pretas têm vantagem";
	return "Posição equilibrada";
}

export default function TelaAnalise() {
	const { modo } = useLocalSearchParams<{ modo: ModoAnalise }>();
	const router = useRouter();
	const { width } = useWindowDimensions();
	const tamTabuleiro = width - 32;

	const boardRef = useRef<ChessboardRef>(null);
	const abortRef = useRef<AbortController | null>(null);

	const [fen, setFen] = useState(FEN_INICIAL);
	const [historico, setHistorico] = useState<string[]>([]);
	const [indice, setIndice] = useState(0);
	const [analise, setAnalise] = useState<AnaliseChessApi | null>(null);
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [cache, setCache] = useState<Record<string, AnaliseChessApi>>({});
	const [analisandoPartida, setAnalisandoPartida] = useState(false);
	const [progressoBatch, setProgressoBatch] = useState({ atual: 0, total: 0 });
	const reproduzindoRef = useRef(false);
	const jaAutoAnalisouRef = useRef(false);

	const [pgnInput, setPgnInput] = useState("");
	const [pgnCarregado, setPgnCarregado] = useState(modo !== "pgn");
	const [erroPgn, setErroPgn] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			setFen(FEN_INICIAL);
			setHistorico([]);
			setIndice(0);
			setAnalise(null);
			setCarregando(false);
			setErro(null);
			setCache({});
			setAnalisandoPartida(false);
			setProgressoBatch({ atual: 0, total: 0 });
			reproduzindoRef.current = false;
			jaAutoAnalisouRef.current = false;
			setPgnInput("");
			setPgnCarregado(modo !== "pgn");
			setErroPgn(null);
			boardRef.current?.resetBoard(FEN_INICIAL);

			return () => {
				abortRef.current?.abort();
				abortRef.current = null;
			};
		}, [modo]),
	);

	useEffect(() => {
		if (!pgnCarregado) return;

		const cached = cache[fen];
		if (cached) {
			setAnalise(cached);
			setCarregando(false);
			setErro(null);
			if (abortRef.current) abortRef.current.abort();
			return;
		}

		if (analisandoPartida) return;

		const timeout = setTimeout(() => {
			if (abortRef.current) abortRef.current.abort();
			const controller = new AbortController();
			abortRef.current = controller;
			setCarregando(true);
			setErro(null);

			analisarPosicao(fen, 12, controller.signal)
				.then((res) => {
					setAnalise(res);
					setCache((c) => ({ ...c, [fen]: res }));
					setCarregando(false);
				})
				.catch((e: Error) => {
					if (e.name === "AbortError") return;
					setErro("Falha ao analisar posição");
					setCarregando(false);
				});
		}, 100);

		return () => clearTimeout(timeout);
	}, [fen, pgnCarregado, cache, analisandoPartida]);

	function aoMover(info: { move: Move; state: { fen: string } }) {
		if (reproduzindoRef.current) return;
		setFen(info.state.fen);
		setHistorico((h) => [...h.slice(0, indice), info.move.san]);
		setIndice((i) => i + 1);
		setAnalise((prev) => (prev ? { ...prev, continuacao: [] } : prev));
	}

	function carregarPgn() {
		try {
			const c = new Chess();
			c.loadPgn(pgnInput.trim());
			const novoFen = c.fen();
			const hist = c.history();
			setFen(novoFen);
			setHistorico(hist);
			setIndice(hist.length);
			setAnalise((prev) => (prev ? { ...prev, continuacao: [] } : prev));
			boardRef.current?.resetBoard(novoFen);
			setPgnCarregado(true);
			setErroPgn(null);
		} catch {
			setErroPgn("PGN inválido");
		}
	}

	function irPara(novoIndice: number) {
		if (novoIndice < 0 || novoIndice > historico.length) return;
		const c = new Chess();
		for (let j = 0; j < novoIndice; j++) c.move(historico[j]);
		const novoFen = c.fen();
		setIndice(novoIndice);
		setFen(novoFen);
		setAnalise((prev) => (prev ? { ...prev, continuacao: [] } : prev));
		boardRef.current?.resetBoard(novoFen);
	}

	function voltar() {
		irPara(indice - 1);
	}

	function avancar() {
		irPara(indice + 1);
	}

	const fensPorIndice = useMemo(() => {
		const fens = [FEN_INICIAL];
		const c = new Chess();
		for (const san of historico) {
			try {
				c.move(san);
			} catch {
				break;
			}
			fens.push(c.fen());
		}
		return fens;
	}, [historico]);

	const lancesInfo = useMemo(() => {
		const info: { uci: string; ehMate: boolean }[] = [];
		const c = new Chess();
		for (const san of historico) {
			try {
				const m = c.move(san);
				const promo = m.promotion ?? "";
				info.push({
					uci: `${m.from}${m.to}${promo}`,
					ehMate: c.isCheckmate(),
				});
			} catch {
				break;
			}
		}
		return info;
	}, [historico]);

	const avaliacoesPorLance = useMemo(() => {
		const mapa = new Map<number, AvaliacaoLance>();
		for (let i = 0; i < historico.length; i++) {
			const fenAntes = fensPorIndice[i];
			const info = lancesInfo[i];
			if (!info) continue;
			const aAntes = cache[fenAntes];
			if (!aAntes) continue;
			const brancasJogaram = i % 2 === 0;
			if (info.ehMate) {
				mapa.set(
					i,
					classificarLance(aAntes, aAntes, info.uci, brancasJogaram, true),
				);
				continue;
			}
			const fenDepois = fensPorIndice[i + 1];
			const aDepois = cache[fenDepois];
			if (!aDepois) continue;
			mapa.set(i, classificarLance(aAntes, aDepois, info.uci, brancasJogaram));
		}
		return mapa;
	}, [historico, fensPorIndice, lancesInfo, cache]);

	const avaliacaoLanceAtual =
		indice > 0 ? avaliacoesPorLance.get(indice - 1) : undefined;

	async function analisarPartida() {
		if (analisandoPartida || historico.length === 0) return;
		setAnalisandoPartida(true);
		reproduzindoRef.current = true;

		const total = historico.length + 1;
		setProgressoBatch({ atual: 0, total });

		boardRef.current?.resetBoard(FEN_INICIAL);
		setFen(FEN_INICIAL);
		setIndice(0);

		const cacheLocal: Record<string, AnaliseChessApi> = { ...cache };

		async function garantirAnalise(f: string) {
			if (cacheLocal[f]) return;
			try {
				const res = await analisarPosicao(f, 12);
				cacheLocal[f] = res;
				setCache((c) => ({ ...c, [f]: res }));
			} catch {
				// ignora falha
			}
		}

		await garantirAnalise(FEN_INICIAL);
		setProgressoBatch({ atual: 1, total });

		for (let i = 0; i < historico.length; i++) {
			const info = lancesInfo[i];
			if (!info) break;
			const from = info.uci.slice(0, 2) as never;
			const to = info.uci.slice(2, 4) as never;
			try {
				await boardRef.current?.move({ from, to });
			} catch {
				// ignora animação falha
			}
			const fenDepois = fensPorIndice[i + 1];
			setFen(fenDepois);
			setIndice(i + 1);
			if (!info.ehMate) {
				await garantirAnalise(fenDepois);
			}
			setProgressoBatch({ atual: i + 2, total });
		}

		reproduzindoRef.current = false;
		setAnalisandoPartida(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: ref guard previne re-execução
	useEffect(() => {
		if (modo !== "pgn") return;
		if (!pgnCarregado) return;
		if (jaAutoAnalisouRef.current) return;
		if (historico.length === 0) return;
		jaAutoAnalisouRef.current = true;
		analisarPartida();
	}, [modo, pgnCarregado, historico.length]);

	const titulo = modo === "pgn" ? "Análise de PGN" : "Nova análise";

	const lances = useMemo(() => {
		const linhas: {
			numero: number;
			brancas: string;
			pretas?: string;
			classifBrancas?: Classificacao;
			classifPretas?: Classificacao;
			indiceBrancas: number;
			indicePretas: number;
		}[] = [];
		for (let i = 0; i < historico.length; i += 2) {
			linhas.push({
				numero: i / 2 + 1,
				brancas: historico[i],
				pretas: historico[i + 1],
				classifBrancas: avaliacoesPorLance.get(i)?.classificacao,
				classifPretas: avaliacoesPorLance.get(i + 1)?.classificacao,
				indiceBrancas: i,
				indicePretas: i + 1,
			});
		}
		return linhas;
	}, [historico, avaliacoesPorLance]);

	if (!pgnCarregado) {
		return (
			<View style={estilos.root}>
				<View style={estilos.cabecalho}>
					<Pressable onPress={() => router.back()} hitSlop={12}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={24}
							color={tema.textoPrimario}
						/>
					</Pressable>
					<Text style={estilos.tituloTela}>Importar PGN</Text>
				</View>
				<View style={estilos.cartaoPgn}>
					<Text style={estilos.labelPgn}>Cole o PGN da partida</Text>
					<TextInput
						style={estilos.inputPgn}
						value={pgnInput}
						onChangeText={setPgnInput}
						placeholder="1. e4 e5 2. Nf3 Nc6..."
						placeholderTextColor={tema.textoMudo}
						multiline
						textAlignVertical="top"
					/>
					{erroPgn && <Text style={estilos.textoErro}>{erroPgn}</Text>}
					<Pressable
						style={[
							estilos.botaoCarregar,
							!pgnInput.trim() && estilos.botaoDesabilitado,
						]}
						onPress={carregarPgn}
						disabled={!pgnInput.trim()}
					>
						<Text style={estilos.textoBotaoCarregar}>Carregar partida</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={estilos.root}>
			<View style={estilos.cabecalho}>
				<Pressable onPress={() => router.back()} hitSlop={12}>
					<MaterialCommunityIcons
						name="arrow-left"
						size={24}
						color={tema.textoPrimario}
					/>
				</Pressable>
				<Text style={estilos.tituloTela}>{titulo}</Text>
			</View>

			{analisandoPartida && (
				<View style={estilos.bannerAnalisando}>
					<ActivityIndicator size="small" color={tema.verde} />
					<View style={estilos.bannerTextos}>
						<Text style={estilos.bannerTitulo}>Analisando partida</Text>
						<Text style={estilos.bannerSubtitulo}>
							{progressoBatch.atual} / {progressoBatch.total} posições
						</Text>
					</View>
					{progressoBatch.total > 0 && (
						<View style={estilos.barraProgresso}>
							<View
								style={[
									estilos.barraProgressoPreenchida,
									{
										width: `${Math.min(
											100,
											(progressoBatch.atual / progressoBatch.total) * 100,
										)}%`,
									},
								]}
							/>
						</View>
					)}
				</View>
			)}

			<View style={estilos.tabuleiroColuna}>
				<BarraAvaliacao
					avaliacao={analise?.avaliacao ?? 0}
					mate={analise?.mate}
					largura={tamTabuleiro}
				/>
				<Chessboard
					ref={boardRef}
					boardSize={tamTabuleiro}
					fen={fen}
					onMove={aoMover}
					colors={coresTabuleiro}
				/>
				<View style={estilos.barraNavegacao}>
					<Pressable
						onPress={voltar}
						disabled={indice === 0}
						style={[
							estilos.botaoNav,
							indice === 0 && estilos.botaoNavDesabilitado,
						]}
						hitSlop={8}
					>
						<MaterialCommunityIcons
							name="chevron-left"
							size={28}
							color={indice === 0 ? tema.textoMudo : tema.textoPrimario}
						/>
					</Pressable>
					<Text style={estilos.indicadorLance}>
						{indice} / {historico.length}
					</Text>
					<Pressable
						onPress={avancar}
						disabled={indice >= historico.length}
						style={[
							estilos.botaoNav,
							indice >= historico.length && estilos.botaoNavDesabilitado,
						]}
						hitSlop={8}
					>
						<MaterialCommunityIcons
							name="chevron-right"
							size={28}
							color={
								indice >= historico.length ? tema.textoMudo : tema.textoPrimario
							}
						/>
					</Pressable>
				</View>
			</View>

			<View style={estilos.cartaoAnalise}>
				<View style={estilos.linhaAnalise}>
					<Text style={estilos.rotulo}>
						{rotuloVantagem(analise?.avaliacao ?? 0, analise?.mate)}
					</Text>
					{carregando && <ActivityIndicator size="small" color={tema.verde} />}
				</View>
				{avaliacaoLanceAtual && indice > 0 && (
					<View style={estilos.linhaAvaliacaoLance}>
						<BadgeClassificacao
							classificacao={avaliacaoLanceAtual.classificacao}
						/>
						<Text style={estilos.detalheTexto}>
							Lance: {historico[indice - 1]}
						</Text>
						{avaliacaoLanceAtual.classificacao !== "melhor" &&
							avaliacaoLanceAtual.melhorLanceSan && (
								<Text style={estilos.detalheMudo}>
									Melhor: {avaliacaoLanceAtual.melhorLanceSan}
								</Text>
							)}
					</View>
				)}
				{erro ? (
					<Text style={estilos.textoErro}>{erro}</Text>
				) : analise ? (
					<View style={estilos.detalhes}>
						<Text style={estilos.detalheTexto}>
							Melhor lance:{" "}
							<Text style={estilos.destaque}>
								{analise.melhorLanceSan || analise.melhorLance || "—"}
							</Text>
						</Text>
						<Text style={estilos.detalheMudo}>
							Profundidade {analise.profundidade}
							{analise.chanceVitoria !== undefined
								? ` · ${analise.chanceVitoria.toFixed(0)}% brancas`
								: ""}
						</Text>
					</View>
				) : (
					<Text style={estilos.detalheMudo}>Aguardando análise...</Text>
				)}
				{historico.length > 0 && (
					<Pressable
						onPress={analisarPartida}
						disabled={analisandoPartida}
						style={[
							estilos.botaoAnalisar,
							analisandoPartida && estilos.botaoDesabilitado,
						]}
					>
						{analisandoPartida ? (
							<Text style={estilos.textoBotaoAnalisar}>
								Analisando {progressoBatch.atual}/{progressoBatch.total}...
							</Text>
						) : (
							<Text style={estilos.textoBotaoAnalisar}>Analisar partida</Text>
						)}
					</Pressable>
				)}
			</View>

			<BarraSugestoes
				fen={fen}
				continuacao={analise?.continuacao ?? []}
				carregando={carregando}
			/>

			<View style={estilos.historicoContainer}>
				<Text style={estilos.historicoTitulo}>Histórico de Lances</Text>
				<ScrollView showsVerticalScrollIndicator={false}>
					{lances.length === 0 ? (
						<Text style={estilos.detalheMudo}>Nenhum lance ainda.</Text>
					) : (
						lances.map((l) => (
							<View key={l.numero} style={estilos.linhaLance}>
								<Text style={estilos.numeroLance}>{l.numero}.</Text>
								<Pressable
									style={estilos.lanceCelula}
									onPress={() => irPara(l.indiceBrancas + 1)}
								>
									<Text
										style={[
											estilos.textoLance,
											l.classifBrancas && {
												color: corClassificacao(l.classifBrancas),
												fontWeight: "700",
											},
											indice === l.indiceBrancas + 1 && estilos.textoLanceAtivo,
										]}
									>
										{l.brancas}
									</Text>
								</Pressable>
								<Pressable
									style={estilos.lanceCelula}
									onPress={() => l.pretas && irPara(l.indicePretas + 1)}
									disabled={!l.pretas}
								>
									<Text
										style={[
											estilos.textoLance,
											l.classifPretas && {
												color: corClassificacao(l.classifPretas),
												fontWeight: "700",
											},
											indice === l.indicePretas + 1 && estilos.textoLanceAtivo,
										]}
									>
										{l.pretas ?? ""}
									</Text>
								</Pressable>
							</View>
						))
					)}
				</ScrollView>
			</View>
		</View>
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
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	tituloTela: {
		color: tema.textoPrimario,
		fontSize: 18,
		fontWeight: "700",
	},
	tabuleiroColuna: {
		alignItems: "center",
		paddingHorizontal: 16,
		gap: 8,
	},
	barraNavegacao: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 24,
		marginTop: 6,
	},
	botaoNav: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: tema.surface,
		borderWidth: 1,
		borderColor: tema.borda,
		alignItems: "center",
		justifyContent: "center",
	},
	botaoNavDesabilitado: {
		opacity: 0.4,
	},
	indicadorLance: {
		color: tema.textoSecundario,
		fontSize: 13,
		fontWeight: "600",
		minWidth: 60,
		textAlign: "center",
	},
	linhaAvaliacaoLance: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flexWrap: "wrap",
	},
	botaoAnalisar: {
		marginTop: 8,
		backgroundColor: tema.verde,
		borderRadius: 8,
		paddingVertical: 8,
		alignItems: "center",
	},
	textoBotaoAnalisar: {
		color: "#0d1117",
		fontSize: 13,
		fontWeight: "700",
	},
	lanceCelula: {
		flex: 1,
	},
	textoLanceAtivo: {
		textDecorationLine: "underline",
	},
	bannerAnalisando: {
		marginHorizontal: 16,
		marginBottom: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: tema.surface,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: tema.verde,
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	bannerTextos: {
		flex: 1,
	},
	bannerTitulo: {
		color: tema.textoPrimario,
		fontSize: 13,
		fontWeight: "700",
	},
	bannerSubtitulo: {
		color: tema.textoSecundario,
		fontSize: 11,
	},
	barraProgresso: {
		width: 80,
		height: 6,
		backgroundColor: tema.surfaceAlt,
		borderRadius: 3,
		overflow: "hidden",
	},
	barraProgressoPreenchida: {
		height: "100%",
		backgroundColor: tema.verde,
	},
	cartaoAnalise: {
		marginHorizontal: 16,
		marginTop: 12,
		padding: 14,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		gap: 6,
	},
	linhaAnalise: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rotulo: {
		color: tema.textoPrimario,
		fontSize: 15,
		fontWeight: "700",
	},
	detalhes: {
		gap: 4,
	},
	detalheTexto: {
		color: tema.textoSecundario,
		fontSize: 14,
	},
	destaque: {
		color: tema.verde,
		fontWeight: "700",
	},
	detalheMudo: {
		color: tema.textoMudo,
		fontSize: 12,
	},
	textoErro: {
		color: tema.vermelho,
		fontSize: 13,
	},
	historicoContainer: {
		flex: 1,
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 12,
		padding: 12,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	historicoTitulo: {
		color: tema.textoPrimario,
		fontSize: 14,
		fontWeight: "700",
		marginBottom: 8,
	},
	linhaLance: {
		flexDirection: "row",
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderBottomColor: tema.borda,
		gap: 12,
	},
	numeroLance: {
		color: tema.textoMudo,
		fontSize: 13,
		width: 28,
	},
	textoLance: {
		flex: 1,
		color: tema.textoPrimario,
		fontSize: 14,
	},
	cartaoPgn: {
		margin: 16,
		padding: 16,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		gap: 12,
	},
	labelPgn: {
		color: tema.textoSecundario,
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 1,
	},
	inputPgn: {
		minHeight: 140,
		backgroundColor: tema.surfaceAlt,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: tema.borda,
		padding: 12,
		color: tema.textoPrimario,
		fontSize: 14,
	},
	botaoCarregar: {
		backgroundColor: tema.verde,
		borderRadius: 10,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	},
	botaoDesabilitado: {
		opacity: 0.4,
	},
	textoBotaoCarregar: {
		color: "#0d1117",
		fontSize: 15,
		fontWeight: "700",
	},
});
