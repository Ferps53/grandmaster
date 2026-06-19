import { useAutenticacao } from "@/src/contextos/AutenticacaoContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tema from "../../src/constantes/tema";

function BarraSuperior() {
	const { sair } = useAutenticacao();
	const [menuAberto, setMenuAberto] = useState(false);

	async function deslogar() {
		setMenuAberto(false);
		await sair();
		router.replace("/login");
	}

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
			<Pressable
				style={{ marginLeft: "auto" }}
				onPress={() => setMenuAberto(true)}
			>
				<MaterialCommunityIcons
					name="account-circle"
					size={32}
					color={tema.textoSecundario}
				/>
			</Pressable>

			<Modal
				visible={menuAberto}
				transparent
				animationType="fade"
				onRequestClose={() => setMenuAberto(false)}
			>
				<Pressable
					style={estilos.overlay}
					onPress={() => setMenuAberto(false)}
				/>
				<View style={estilos.menu}>
					<Pressable style={estilos.itemMenu} onPress={deslogar}>
						<MaterialCommunityIcons
							name="logout"
							size={20}
							color={tema.vermelho}
						/>
						<Text style={estilos.itemMenuTexto}>Sair</Text>
					</Pressable>
				</View>
			</Modal>
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
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	menu: {
		position: "absolute",
		top: 56,
		right: 12,
		backgroundColor: tema.surface,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: tema.borda,
		paddingVertical: 6,
		minWidth: 160,
	},
	itemMenu: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	itemMenuTexto: {
		color: tema.vermelho,
		fontSize: 15,
		fontWeight: "600",
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
					name="puzzles"
					options={{
						title: "Puzzles",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="puzzle" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="analise_menu"
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
				<Tabs.Screen name="analise/[modo]" options={{ href: null }} />
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
