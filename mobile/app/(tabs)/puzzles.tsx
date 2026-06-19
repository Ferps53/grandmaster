import tema, { coresTabuleiro } from "@/src/constantes/tema";
import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import type { PuzzleProximo, ResultadoPuzzle } from "@/src/model/Puzzle";
import servicoAPI from "@/src/servicos/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Chess, type Square } from "chess.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import type { ChessboardRef } from "react-native-chessboard";
import Chessboard from "react-native-chessboard";

type FaseTurno = "carregando" | "oponente" | "jogador" | "finalizado" | "erro";

const DELAY_LANCE_OPONENTE_MS = 500;

function corDoJogador(fen: string): "branco" | "preto" {
	// FEN do CSV Lichess está sempre na vez do oponente fazer o lance de setup.
	// Jogador joga com a cor oposta.
	const turno = fen.split(" ")[1];
	return turno === "w" ? "preto" : "branco";
}

function uciFromMove(move: {
	from: string;
	to: string;
	promotion?: string;
}): string {
	return `${move.from}${move.to}${move.promotion ?? ""}`;
}

export default function TelaPuzzles() {
	const { token } = useAutenticacao();
	const { width } = useWindowDimensions();
	const tamTabuleiro = width - 32;

	const [puzzle, setPuzzle] = useState<PuzzleProximo | null>(null);
	const [fase, setFase] = useState<FaseTurno>("carregando");
	const [erro, setErro] = useState<string | null>(null);
	const [idxJogador, setIdxJogador] = useState(0);
	const [tentativas, setTentativas] = useState(1);
	const [errouNessaTentativa, setErrouNessaTentativa] = useState(false);
	const [resultado, setResultado] = useState<ResultadoPuzzle | null>(null);

	const boardRef = useRef<ChessboardRef>(null);
	const jogoRef = useRef<Chess | null>(null);
	const lancesJogadosRef = useRef<string[]>([]);

	const carregarProximo = useCallback(async () => {
		if (!token) {
			return;
		}
		setFase("carregando");
		setErro(null);
		setResultado(null);
		setIdxJogador(0);
		setTentativas(1);
		setErrouNessaTentativa(false);
		lancesJogadosRef.current = [];
		try {
			const proximo = await servicoAPI.obterProximoPuzzle(token);
			jogoRef.current = new Chess(proximo.fen);
			setPuzzle(proximo);
		} catch (err) {
			setErro(err instanceof Error ? err.message : "Erro ao carregar puzzle");
			setFase("erro");
		}
	}, [token]);

	useEffect(() => {
		void carregarProximo();
	}, [carregarProximo]);

	const tocarLanceOponente = useCallback(async (uci: string) => {
		const from = uci.slice(0, 2) as Square;
		const to = uci.slice(2, 4) as Square;
		const promotion = uci.length > 4 ? uci[4] : undefined;
		await new Promise((r) => setTimeout(r, DELAY_LANCE_OPONENTE_MS));
		jogoRef.current?.move({ from, to, promotion });
		await boardRef.current?.move({ from, to });
	}, []);

	const restaurarTabuleiro = useCallback(async () => {
		if (!puzzle || !jogoRef.current) {
			return;
		}
		jogoRef.current = new Chess(puzzle.fen);
		boardRef.current?.resetBoard(puzzle.fen);
		await new Promise((r) => setTimeout(r, 150));
		// Reaplica setup do oponente + todos os lances corretos já feitos.
		const lancesCorretos = lancesJogadosRef.current;
		const sequencia: string[] = [];
		sequencia.push(puzzle.lancesOponente[0]);
		for (let i = 0; i < lancesCorretos.length; i++) {
			sequencia.push(lancesCorretos[i]);
			const respostaOponente = puzzle.lancesOponente[i + 1];
			if (respostaOponente) {
				sequencia.push(respostaOponente);
			}
		}
		for (const uci of sequencia) {
			const from = uci.slice(0, 2) as Square;
			const to = uci.slice(2, 4) as Square;
			const promotion = uci.length > 4 ? uci[4] : undefined;
			jogoRef.current.move({ from, to, promotion });
			await boardRef.current?.move({ from, to });
			await new Promise((r) => setTimeout(r, 80));
		}
	}, [puzzle]);

	// Setup inicial: aplica primeiro lance do oponente quando puzzle carrega.
	useEffect(() => {
		if (!puzzle) {
			return;
		}
		let cancelado = false;
		(async () => {
			setFase("oponente");
			await new Promise((r) => setTimeout(r, 200));
			if (cancelado) {
				return;
			}
			await tocarLanceOponente(puzzle.lancesOponente[0]);
			if (!cancelado) {
				setFase("jogador");
			}
		})();
		return () => {
			cancelado = true;
		};
	}, [puzzle, tocarLanceOponente]);

	const submeterResultado = useCallback(
		async (lancesFinais: string[]) => {
			if (!token || !puzzle) {
				return;
			}
			setFase("finalizado");
			try {
				const res = await servicoAPI.enviarResultadoPuzzle(token, puzzle.id, {
					lancesJogados: lancesFinais,
					tentativas,
				});
				setResultado(res);
			} catch (err) {
				setErro(
					err instanceof Error ? err.message : "Erro ao enviar resultado",
				);
			}
		},
		[token, puzzle, tentativas],
	);

	const aoMover = useCallback(
		async ({
			move,
		}: {
			move: { from: string; to: string; promotion?: string };
		}) => {
			if (!puzzle || fase !== "jogador") {
				return;
			}
			const uci = uciFromMove(move);
			const esperado = puzzle.lancesJogadorEsperados[idxJogador];

			if (uci !== esperado) {
				setErrouNessaTentativa(true);
				setTentativas((t) => t + 1);
				setFase("oponente");
				await new Promise((r) => setTimeout(r, 600));
				await restaurarTabuleiro();
				setFase("jogador");
				return;
			}

			jogoRef.current?.move({
				from: move.from as Square,
				to: move.to as Square,
				promotion: move.promotion,
			});
			lancesJogadosRef.current = [...lancesJogadosRef.current, uci];
			const proximoIdx = idxJogador + 1;
			const fim = proximoIdx >= puzzle.lancesJogadorEsperados.length;

			if (fim) {
				await submeterResultado(lancesJogadosRef.current);
				return;
			}

			setFase("oponente");
			await tocarLanceOponente(puzzle.lancesOponente[proximoIdx]);
			setIdxJogador(proximoIdx);
			setFase("jogador");
		},
		[
			puzzle,
			fase,
			idxJogador,
			restaurarTabuleiro,
			submeterResultado,
			tocarLanceOponente,
		],
	);

	if (fase === "carregando" || !puzzle) {
		return (
			<View style={estilos.rootCentralizado}>
				<ActivityIndicator color={tema.verde} />
			</View>
		);
	}

	if (fase === "erro") {
		return (
			<View style={estilos.rootCentralizado}>
				<Text style={estilos.erroTexto}>{erro ?? "Erro desconhecido"}</Text>
				<Pressable style={estilos.botaoPrimario} onPress={carregarProximo}>
					<Text style={estilos.botaoPrimarioTexto}>Tentar novamente</Text>
				</Pressable>
			</View>
		);
	}

	const cor = corDoJogador(puzzle.fen);
	const lanceAtual = idxJogador + 1;
	const totalLances = puzzle.lancesJogadorEsperados.length;

	return (
		<View style={estilos.root}>
			<View style={estilos.centralizador}>
				<View style={estilos.headerInfo}>
					<View style={estilos.headerBloco}>
						<Text style={estilos.headerRotulo}>RATING DO PUZZLE</Text>
						<Text style={estilos.headerValor}>{puzzle.rating}</Text>
					</View>
					<View style={estilos.headerBloco}>
						<Text style={estilos.headerRotulo}>VOCÊ JOGA COM</Text>
						<Text style={estilos.headerValor}>
							{cor === "branco" ? "Brancas" : "Pretas"}
						</Text>
					</View>
					<View style={estilos.headerBloco}>
						<Text style={estilos.headerRotulo}>LANCE</Text>
						<Text style={estilos.headerValor}>
							{lanceAtual} / {totalLances}
						</Text>
					</View>
				</View>
				<View style={estilos.tabuleiroWrapper}>
					<Chessboard
						ref={boardRef}
						boardSize={tamTabuleiro}
						fen={puzzle.fen}
						gestureEnabled={fase === "jogador"}
						onMove={aoMover}
						colors={coresTabuleiro}
						withLetters
						withNumbers
					/>
				</View>

				<View
					style={[
						estilos.avisoErro,
						!(errouNessaTentativa && fase !== "finalizado") &&
							estilos.avisoErroInvisivel,
					]}
				>
					{errouNessaTentativa && fase !== "finalizado" && (
						<>
							<MaterialCommunityIcons
								name="alert-circle"
								size={18}
								color={tema.vermelho}
							/>
							<Text style={estilos.avisoErroTexto}>
								Você errou — rating será reduzido ao terminar
							</Text>
						</>
					)}
				</View>
			</View>

			{fase === "finalizado" && resultado && (
				<View style={estilos.painelResultado}>
					<MaterialCommunityIcons
						name={
							resultado.resolveuPrimeira
								? "trophy"
								: resultado.resolveu
									? "check-circle"
									: "close-circle"
						}
						size={48}
						color={
							resultado.resolveuPrimeira
								? tema.verde
								: resultado.resolveu
									? tema.verde
									: tema.vermelho
						}
					/>
					<Text style={estilos.resultadoTitulo}>
						{resultado.resolveuPrimeira
							? "Excelente!"
							: resultado.resolveu
								? "Concluído"
								: "Sem sucesso"}
					</Text>
					<View style={estilos.linhaRating}>
						<Text style={estilos.ratingTexto}>
							{Math.round(resultado.ratingAntigo)}
						</Text>
						<MaterialCommunityIcons
							name="arrow-right"
							size={18}
							color={tema.textoMudo}
						/>
						<Text style={estilos.ratingTexto}>
							{Math.round(resultado.ratingNovo)}
						</Text>
						<Text
							style={[
								estilos.deltaTexto,
								resultado.delta >= 0
									? estilos.deltaPositivo
									: estilos.deltaNegativo,
							]}
						>
							{resultado.delta >= 0 ? "+" : ""}
							{Math.round(resultado.delta)}
						</Text>
					</View>
					<Pressable style={estilos.botaoPrimario} onPress={carregarProximo}>
						<Text style={estilos.botaoPrimarioTexto}>Próximo puzzle</Text>
					</Pressable>
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
	rootCentralizado: {
		flex: 1,
		backgroundColor: tema.bg,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
		gap: 16,
	},
	headerInfo: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 12,
	},
	headerBloco: {
		flex: 1,
		backgroundColor: tema.surface,
		borderRadius: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	headerRotulo: {
		color: tema.textoMudo,
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 1,
	},
	headerValor: {
		color: tema.textoPrimario,
		fontSize: 18,
		fontWeight: "700",
		marginTop: 4,
	},
	centralizador: {
		flex: 1,
		justifyContent: "center",
	},
	tabuleiroWrapper: {
		alignSelf: "center",
		borderRadius: 12,
		overflow: "hidden",
	},
	avisoErro: {
		minHeight: 50,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "rgba(239,68,68,0.1)",
		borderColor: "rgba(239,68,68,0.3)",
		borderWidth: 1,
		borderRadius: 10,
		padding: 12,
		marginHorizontal: 16,
		marginTop: 12,
	},
	avisoErroInvisivel: {
		backgroundColor: "transparent",
		borderColor: "transparent",
	},
	avisoErroTexto: {
		color: tema.vermelho,
		fontSize: 13,
		fontWeight: "600",
		flex: 1,
	},
	painelResultado: {
		marginHorizontal: 16,
		marginTop: 16,
		backgroundColor: tema.surface,
		borderRadius: 14,
		padding: 20,
		alignItems: "center",
		gap: 10,
		borderWidth: 1,
		borderColor: tema.borda,
	},
	resultadoTitulo: {
		color: tema.textoPrimario,
		fontSize: 22,
		fontWeight: "700",
	},
	linhaRating: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	ratingTexto: {
		color: tema.textoPrimario,
		fontSize: 20,
		fontWeight: "700",
		fontVariant: ["tabular-nums"],
	},
	deltaTexto: {
		fontSize: 18,
		fontWeight: "800",
		marginLeft: 8,
	},
	deltaPositivo: {
		color: tema.verde,
	},
	deltaNegativo: {
		color: tema.vermelho,
	},
	botaoPrimario: {
		backgroundColor: tema.verde,
		paddingHorizontal: 32,
		paddingVertical: 14,
		borderRadius: 12,
		marginTop: 8,
	},
	botaoPrimarioTexto: {
		color: "#0d1117",
		fontWeight: "800",
		fontSize: 16,
	},
	erroTexto: {
		color: tema.vermelho,
		textAlign: "center",
	},
});
