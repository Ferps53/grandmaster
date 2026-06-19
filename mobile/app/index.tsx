import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import tema from "../src/constantes/tema";
import { useAutenticacao } from "../src/contextos/AutenticacaoContext";

export default function Raiz() {
	const { token, carregando } = useAutenticacao();

	if (carregando) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: tema.bg,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator color={tema.verde} />
			</View>
		);
	}

	return <Redirect href={token ? "/(tabs)" : "/login"} />;
}
