import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import tema from "../src/constantes/tema";
import { ProveedorAutenticacao } from "../src/contextos/AutenticacaoContext";

export default function RootLayout() {
	return (
		<ProveedorAutenticacao>
			<GestureHandlerRootView>
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: tema.bg },
						animation: "fade",
					}}
				/>
			</GestureHandlerRootView>
		</ProveedorAutenticacao>
	);
}
