import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import tema from "../src/constantes/tema";
import { ProveedorAutenticacao } from "../src/contextos/AutenticacaoContext";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

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
