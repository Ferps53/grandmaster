import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import tema from "@/src/constantes/tema";
import type { Licao } from "@/src/model/Licao";
import { estilosNo } from "./estilosNo";

export default function NoConcluido(licao: Licao) {
	const offset = licao.offset;
	const labelNaDireita = offset >= 0;
	return (
		<View style={estilosNo.wrapper}>
			<View
				style={[
					estilosNo.linha,
					{ justifyContent: labelNaDireita ? "flex-start" : "flex-end" },
				]}
			>
				{!labelNaDireita && (
					<Text
						style={[estilosNo.label, estilos.label, { textAlign: "right" }]}
					>
						{licao.titulo}
					</Text>
				)}

				<View
					style={[
						estilosNo.no,
						estilos.no,
						{
							marginLeft: labelNaDireita ? offset : 0,
							marginRight: !labelNaDireita ? Math.abs(offset) : 0,
						},
					]}
				>
					<MaterialCommunityIcons
						name={licao.icone}
						size={24}
						color={tema.surface}
					/>
				</View>

				{labelNaDireita && (
					<Text style={[estilosNo.label, estilos.label]}>{licao.titulo}</Text>
				)}
			</View>
		</View>
	);
}

const estilos = StyleSheet.create({
	no: {
		borderColor: tema.verde,
		backgroundColor: tema.verde,
	},
	label: {
		color: tema.textoPrimario,
	},
});
