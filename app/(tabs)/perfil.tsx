import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import tema from "../../src/constantes/tema";

const estilo = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tema.bg,
  },
  headerPerfil: {
    padding: 20,
    alignItems: "flex-start",
  },
  rankTexto: {
    color: tema.verde,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  nomeUsuario: {
    color: tema.textoPrimario,
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 4,
  },
  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  badgeElo: {
    flexDirection: "row",
    backgroundColor: "#1e2330",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    gap: 5,
  },
  textoElo: {
    color: tema.textoPrimario,
    fontWeight: "bold",
  },
  textoMudo: {
    color: tema.textoMudo,
    fontSize: 14,
  },
  cartaoStatus: {
    backgroundColor: tema.surfaceAlt,
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  tituloSessao: {
    color: tema.textoMudo,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rowEstatisticas: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  porcentagemGrande: {
    color: tema.textoPrimario,
    fontSize: 48,
    fontWeight: "bold",
  },
  tendencia: {
    fontSize: 18,
    fontWeight: "bold",
  },
  barraProgressoContainer: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 20,
  },
  barraParte: {
    height: "100%",
  },
  sessaoConquistas: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  cardConquista: {
    backgroundColor: tema.surfaceAlt,
    width: 100,
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    padding: 10,
  },
  textoConquista: {
    color: tema.textoPrimario,
    fontSize: 10,
    textAlign: "center",
    marginTop: 8,
  },
  sessaoPartidas: {
    padding: 20,
  },
  itemPartida: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.surfaceAlt,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: tema.verde,
  },
  itemPartidaDerrota: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.surfaceAlt,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: tema.vermelho,
  },
  avatarOponente: {
    width: 40,
    height: 40,
    backgroundColor: "#2a2f3e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
  botaoHistorico: {
    alignItems: "center",
    padding: 20,
    marginBottom: 40,
  },
  textoBotaoHistorico: {
    color: tema.verde,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default function TelaPerfil() {
  return (
    <View style={estilo.root} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilo.headerPerfil}>
          <Text style={estilo.rankTexto}>RANK: BRONZE</Text>
          <Text style={estilo.nomeUsuario}>Matheus Ris</Text>
          <View style={estilo.linhaInfo}>
            <View style={estilo.badgeElo}>
              <MaterialCommunityIcons
                name="star"
                size={14}
                color={tema.verde}
              />
              <Text style={estilo.textoElo}>500 Elo</Text>
            </View>
            <Text style={estilo.textoMudo}>Entrou em Março de 2021</Text>
          </View>
        </View>

        <View style={estilo.cartaoStatus}>
          <Text style={estilo.tituloSessao}>VITÓRIA / DERROTA / EMPATE</Text>
          <View style={estilo.rowEstatisticas}>
            <Text style={estilo.porcentagemGrande}>64%</Text>
            <Text style={[estilo.tendencia, { color: tema.verde }]}>
              ↑ 2.4%
            </Text>
          </View>

          <View style={estilo.barraProgressoContainer}>
            <View
              style={[
                estilo.barraParte,
                { flex: 0.64, backgroundColor: tema.verde },
              ]}
            />
            <View
              style={[
                estilo.barraParte,
                { flex: 0.22, backgroundColor: tema.textoSecundario },
              ]}
            />
            <View
              style={[
                estilo.barraParte,
                { flex: 0.14, backgroundColor: tema.vermelho },
              ]}
            />
          </View>
        </View>

        <View style={estilo.sessaoConquistas}>
          <Text style={estilo.tituloSessao}>CONQUISTAS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={estilo.cardConquista}>
              <MaterialCommunityIcons
                name="trophy"
                size={30}
                color={tema.verde}
              />
              <Text style={estilo.textoConquista}>Vitória Rápida</Text>
            </View>

            <View style={estilo.cardConquista}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={30}
                color={tema.verde}
              />
              <Text style={estilo.textoConquista}>Tático</Text>
            </View>

            <View style={estilo.cardConquista}>
              <MaterialCommunityIcons
                name="shield"
                size={30}
                color={tema.verde}
              />
              <Text style={estilo.textoConquista}>Defesa Sólida</Text>
            </View>

            <View style={estilo.cardConquista}>
              <MaterialCommunityIcons
                name="chess-king"
                size={30}
                color={tema.verde}
              />
              <Text style={estilo.textoConquista}>Full House</Text>
            </View>
          </ScrollView>
        </View>

        <View style={estilo.sessaoPartidas}>
          <Text style={estilo.tituloSessao}>PARTIDAS RECENTES</Text>

          <View style={estilo.itemPartida}>
            <View style={estilo.avatarOponente}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={tema.textoMudo}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={estilo.nomeOponente}>Chess Player_</Text>
              <Text style={estilo.detalhePartida}>BLITZ • 3M + 2S</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[estilo.resultadoPartida, { color: tema.verde }]}>
                Vitória
              </Text>
              <Text style={estilo.eloGanho}>+12 Elo</Text>
            </View>
          </View>

          <View style={estilo.itemPartidaDerrota}>
            <View style={estilo.avatarOponente}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={tema.textoMudo}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={estilo.nomeOponente}>Carlinhos_gamer</Text>
              <Text style={estilo.detalhePartida}>BLITZ • 5M</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[estilo.resultadoPartida, { color: tema.vermelho }]}>
                Derrota
              </Text>
              <Text style={estilo.eloGanho}>-15 Elo</Text>
            </View>
          </View>
        </View>

        <Pressable style={estilo.botaoHistorico}>
          <Text style={estilo.textoBotaoHistorico}>VER HISTÓRICO COMPLETO</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
