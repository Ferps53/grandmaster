import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import tema from "../src/constantes/tema";
export default function RootLayout() {
	return (
		<GestureHandlerRootView>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: tema.bg },
					animation: "fade",
				}}
			/>
		</GestureHandlerRootView>
	);
}
