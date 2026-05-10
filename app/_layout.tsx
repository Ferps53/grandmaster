import { Stack } from "expo-router";
import tema from "../src/constantes/tema";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: tema.bg },
				animation: "fade",
			}}
		/>
	);
}
