import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import tema from "../constantes/tema";
import type { PropsParidasAnteriores } from "../model/PartidasAnteriores";

export default function PartidasAnteriores({
	nome,
	elo,
	status,
	ativo = false,
}: PropsParidasAnteriores) {
	function getStatus(s: "V" | "E" | "D"): string {
		switch (s) {
			case "V":
				return "Vitória";
			case "E":
				return "Empate";
			case "D":
				return "Derrota";
		}
	}

	function getStatusColor(s: "V" | "E" | "D"): string {
		switch (s) {
			case "V":
				return tema.verde;
			case "E":
				return tema.textoSecundario;
			case "D":
				return "#FF0000";
		}
	}

	return (
		<View
			style={{
				backgroundColor: tema.surface,
				borderRadius: 16,
				marginHorizontal: 16,
				marginVertical: 8,
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<View style={{ position: "relative" }}>
				<MaterialCommunityIcons
					name="account"
					size={64}
					color={tema.textoSecundario}
				/>
				{ativo && (
					<View
						style={{
							width: 12,
							height: 12,
							borderRadius: 12,
							backgroundColor: tema.verde,
							position: "absolute",
							bottom: 6,
							right: 4,
							borderWidth: 2,
							borderColor: tema.surface,
						}}
					/>
				)}
			</View>
			<View>
				<Text
					style={{ color: tema.textoPrimario, fontSize: 16, fontWeight: "600" }}
				>
					{nome} - {elo} elo
				</Text>
				<Text
					style={{
						color: getStatusColor(status),
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					{getStatus(status)}
				</Text>
			</View>

			<MaterialCommunityIcons
				style={{ marginLeft: "auto" }}
				name="chevron-right"
				size={48}
				color={tema.textoSecundario}
			/>
		</View>
	);
}
