import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import tema from "@/src/constantes/tema";
import type { Licao } from "@/src/model/Licao";
import { estilosNo } from "./estilosNo";

export default function NoAtual(licao: Licao) {
	return (
		<View style={estilosNo.wrapper}>
			<View style={[estilosNo.linha, { justifyContent: "flex-start" }]}>
				<Pressable
					style={[estilosNo.no, estilos.no, { marginLeft: licao.offset }]}
				>
					<MaterialCommunityIcons
						name={licao.icone}
						size={28}
						color="#0d1117"
					/>
				</Pressable>
				<View style={estilos.badge}>
					<Text style={estilos.badgeTexto}>
						ATUAL: {licao.titulo.toUpperCase()}
					</Text>
				</View>
			</View>
		</View>
	);
}

const estilos = StyleSheet.create({
	no: {
		borderColor: tema.verde,
		backgroundColor: tema.verde,
		shadowColor: tema.verde,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 12,
		elevation: 10,
	},
	badge: {
		backgroundColor: tema.verde,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	badgeTexto: {
		color: "#0d1117",
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
});
