import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tema from "../../src/constantes/tema";

function BarraSuperior() {
	return (
		<View style={estilos.barraSuperior}>
			<View>
				<MaterialCommunityIcons
					name="chess-bishop"
					size={32}
					color={tema.verde}
				/>
			</View>
			<Text style={estilos.titulo}>Grandmaster</Text>
			<Pressable style={{ marginLeft: "auto" }}>
				<MaterialCommunityIcons
					name="account-circle"
					size={32}
					color={tema.textoSecundario}
				/>
			</Pressable>
		</View>
	);
}

const estilos = StyleSheet.create({
	barraSuperior: {
		paddingHorizontal: 8,
		flexDirection: "row",
		height: 50,
		alignItems: "center",
		gap: 8,
	},
	titulo: {
		fontSize: 32,
		fontStyle: "italic",
		textAlignVertical: "center",
		textAlign: "center",
		fontWeight: "700",
		color: tema.verde,
		letterSpacing: -1,
	},
});
export default function LayoutTabs() {
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: tema.surface }}
			edges={["top"]}
		>
			<BarraSuperior />

			<Tabs
				screenOptions={{
					sceneStyle: {
						backgroundColor: tema.bg,
					},
					headerShown: false,
					tabBarStyle: {
						backgroundColor: tema.surface,
						borderTopColor: tema.borda,
					},
					tabBarActiveTintColor: tema.verde,
					tabBarInactiveTintColor: tema.textoSecundario,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Início",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="home" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="jogar"
					options={{
						title: "Jogar",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="chess-knight"
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="analisar"
					options={{
						title: "Analisar",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="chart-line"
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="aprender"
					options={{
						title: "Aprender",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="school" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="perfil"
					options={{
						title: "Perfil",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="account"
								size={size}
								color={color}
							/>
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}
