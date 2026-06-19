import tema from "@/src/constantes/tema";
import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import type { Perfil } from "@/src/model/Perfil";
import type { TentativaPuzzle } from "@/src/model/Puzzle";
import servicoAPI from "@/src/servicos/api";
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

const LIMITE_RD_PROVISORIO = 110;

const meses = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro",
];

function formatarDataDeEntrada(rawDate?: string | null) {
	if (!rawDate) {
		return "Entrou recentemente";
	}
	const date = new Date(rawDate);
	if (Number.isNaN(date.getTime())) {
		return "Data de entrada desconhecida";
	}
	const mes = meses[date.getMonth()];
	const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
	return `Entrou em ${mesCapitalizado} de ${date.getFullYear()}`;
}

function formatarDataRelativa(iso: string): string {
	const data = new Date(iso);
	if (Number.isNaN(data.getTime())) {
		return "";
	}
	const diffMs = Date.now() - data.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1) {
		return "agora";
	}
	if (diffMin < 60) {
		return `há ${diffMin} min`;
	}
	const diffH = Math.floor(diffMin / 60);
	if (diffH < 24) {
		return `há ${diffH}h`;
	}
	const diffD = Math.floor(diffH / 24);
	if (diffD < 30) {
		return `há ${diffD}d`;
	}
	return data.toLocaleDateString("pt-BR");
}

function ItemTentativa({ tentativa }: { tentativa: TentativaPuzzle }) {
	const sucesso = tentativa.resolveuPrimeira;
	const delta = Math.round(tentativa.deltaRating);
	return (
		<View
			style={[
				estilo.itemTentativa,
				sucesso ? estilo.itemBordaSucesso : estilo.itemBordaErro,
			]}
		>
			<MaterialCommunityIcons
				name={sucesso ? "check-circle" : "close-circle"}
				size={24}
				color={sucesso ? tema.verde : tema.vermelho}
			/>
			<View style={estilo.itemInfo}>
				<Text style={estilo.itemTitulo}>Puzzle {tentativa.puzzleId}</Text>
				<Text style={estilo.itemSubtitulo}>
					{tentativa.tentativas}{" "}
					{tentativa.tentativas === 1 ? "tentativa" : "tentativas"} ·{" "}
					{formatarDataRelativa(tentativa.criadoEm)}
				</Text>
			</View>
			<Text
				style={[
					estilo.itemDelta,
					delta >= 0 ? estilo.deltaPositivo : estilo.deltaNegativo,
				]}
			>
				{delta >= 0 ? "+" : ""}
				{delta}
			</Text>
		</View>
	);
}

export default function TelaPerfil() {
	const { usuario, token } = useAutenticacao();
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [carregando, setCarregando] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		if (!token) {
			return;
		}
		setCarregando(true);
		setErro(null);
		try {
			const dados = await servicoAPI.obterPerfil(token);
			setPerfil(dados);
		} catch (err) {
			setErro(err instanceof Error ? err.message : "Erro ao carregar perfil");
		} finally {
			setCarregando(false);
		}
	}, [token]);

	useFocusEffect(
		useCallback(() => {
			void carregar();
		}, [carregar]),
	);

	if (carregando) {
		return (
			<View style={estilo.centralizado}>
				<ActivityIndicator color={tema.verde} />
			</View>
		);
	}

	if (erro || !perfil) {
		return (
			<View style={estilo.centralizado}>
				<Text style={estilo.erroTexto}>{erro ?? "Perfil indisponível"}</Text>
			</View>
		);
	}

	const ratingExibido = Math.round(perfil.rating);
	const provisorio = perfil.rd > LIMITE_RD_PROVISORIO;
	const nome = perfil.nome ?? usuario?.nome ?? "Jogador";

	return (
		<View style={estilo.root}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={estilo.header}>
					<Text style={estilo.nomeUsuario}>{nome}</Text>
					<Text style={estilo.textoMudo}>
						{formatarDataDeEntrada(perfil.criadoEm)}
					</Text>
					<View style={estilo.badges}>
						<View style={estilo.badgeRating}>
							<MaterialCommunityIcons
								name="puzzle"
								size={16}
								color={tema.verde}
							/>
							<Text style={estilo.badgeRatingTexto}>
								{ratingExibido}
								{provisorio ? "?" : ""}
							</Text>
						</View>
						<View style={estilo.badgeXp}>
							<MaterialCommunityIcons
								name="star-four-points"
								size={14}
								color="#0d1117"
							/>
							<Text style={estilo.badgeXpTexto}>{perfil.xp} XP</Text>
						</View>
					</View>
					{provisorio && (
						<Text style={estilo.textoMudo}>
							Rating provisório — resolva mais puzzles pra estabilizar
						</Text>
					)}
				</View>

				<View style={estilo.secao}>
					<Text style={estilo.tituloSecao}>HISTÓRICO DE PUZZLES</Text>
					{perfil.tentativasRecentes.length === 0 ? (
						<Text style={estilo.textoVazio}>Nenhum puzzle resolvido ainda</Text>
					) : (
						perfil.tentativasRecentes.map((t) => (
							<ItemTentativa
								key={`${t.puzzleId}-${t.criadoEm}`}
								tentativa={t}
							/>
						))
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const estilo = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: tema.bg,
	},
	centralizado: {
		flex: 1,
		backgroundColor: tema.bg,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	header: {
		padding: 20,
		gap: 8,
	},
	nomeUsuario: {
		color: tema.textoPrimario,
		fontSize: 28,
		fontWeight: "800",
	},
	textoMudo: {
		color: tema.textoMudo,
		fontSize: 13,
	},
	badges: {
		flexDirection: "row",
		gap: 10,
		marginTop: 6,
	},
	badgeRating: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: tema.surfaceAlt,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
	},
	badgeRatingTexto: {
		color: tema.textoPrimario,
		fontWeight: "700",
		fontSize: 14,
	},
	badgeXp: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: tema.verde,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	badgeXpTexto: {
		color: "#0d1117",
		fontWeight: "800",
		fontSize: 13,
	},
	secao: {
		paddingHorizontal: 20,
		paddingBottom: 40,
		gap: 8,
	},
	tituloSecao: {
		color: tema.textoMudo,
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 1,
		marginBottom: 6,
	},
	textoVazio: {
		color: tema.textoMudo,
		fontSize: 14,
		textAlign: "center",
		padding: 20,
	},
	itemTentativa: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		backgroundColor: tema.surfaceAlt,
		padding: 12,
		borderRadius: 10,
		borderLeftWidth: 4,
	},
	itemBordaSucesso: {
		borderLeftColor: tema.verde,
	},
	itemBordaErro: {
		borderLeftColor: tema.vermelho,
	},
	itemInfo: {
		flex: 1,
		gap: 2,
	},
	itemTitulo: {
		color: tema.textoPrimario,
		fontWeight: "600",
		fontSize: 14,
	},
	itemSubtitulo: {
		color: tema.textoMudo,
		fontSize: 12,
	},
	itemDelta: {
		fontSize: 16,
		fontWeight: "800",
		fontVariant: ["tabular-nums"],
	},
	deltaPositivo: {
		color: tema.verde,
	},
	deltaNegativo: {
		color: tema.vermelho,
	},
	erroTexto: {
		color: tema.vermelho,
		textAlign: "center",
	},
});
