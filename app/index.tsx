import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

const COLORS = {
	bg: "#0d1117",
	surface: "#161b22",
	surfaceAlt: "#1c2330",
	border: "#21262d",
	green: "#4ade80",
	textPrimary: "#f0f6fc",
	textSecondary: "#8b949e",
	textMuted: "#484f58",
};

export default function LoginScreen() {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	function handleLogin() {
		// TODO: hook up auth
		router.replace("/(tabs)");
	}

	return (
		<SafeAreaView style={styles.root} edges={["bottom"]}>
			<KeyboardAvoidingView
				style={styles.root}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.content}>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.iconWrapper}>
							<MaterialCommunityIcons
								name="chess-pawn"
								size={36}
								color={COLORS.green}
							/>
						</View>
						<Text style={styles.title}>Grandmaster</Text>
						<Text style={styles.subtitle}>THE INTELLECTUAL SANCTUARY</Text>
					</View>

					{/* Card */}
					<View style={styles.card}>
						<View style={styles.cardHeading}>
							<Text style={styles.cardTitle}>Bem-vindo de Volta</Text>
							<Text style={styles.cardSubtitle}>
								Por favor, insira suas credenciais táticas.
							</Text>
						</View>

						{/* Email field */}
						<View style={styles.fieldGroup}>
							<Text style={styles.fieldLabel}>ID DE GRANDE MESTRE</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedField === "id" && styles.inputWrapperFocused,
								]}
							>
								<MaterialCommunityIcons
									name="at"
									size={20}
									color={
										focusedField === "id" ? COLORS.green : COLORS.textSecondary
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="E-mail ou Usuário"
									placeholderTextColor={COLORS.textMuted}
									value={identifier}
									onChangeText={setIdentifier}
									onFocus={() => setFocusedField("id")}
									onBlur={() => setFocusedField(null)}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							</View>
						</View>

						{/* Password field */}
						<View style={styles.fieldGroup}>
							<Text style={styles.fieldLabel}>CHAVE SECRETA</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedField === "pw" && styles.inputWrapperFocused,
								]}
							>
								<MaterialCommunityIcons
									name="lock-outline"
									size={20}
									color={
										focusedField === "pw" ? COLORS.green : COLORS.textSecondary
									}
								/>
								<TextInput
									style={styles.input}
									placeholder="••••••••••"
									placeholderTextColor={COLORS.textMuted}
									value={password}
									onChangeText={setPassword}
									onFocus={() => setFocusedField("pw")}
									onBlur={() => setFocusedField(null)}
									secureTextEntry={!showPassword}
								/>
								<Pressable
									onPress={() => setShowPassword((v) => !v)}
									hitSlop={8}
								>
									<MaterialCommunityIcons
										name={showPassword ? "eye-off-outline" : "eye-outline"}
										size={20}
										color={COLORS.textSecondary}
									/>
								</Pressable>
							</View>
							<Pressable style={styles.forgotBtn}>
								<Text style={styles.forgotLink}>Esqueceu a senha?</Text>
							</Pressable>
						</View>

						{/* Login button */}
						<Pressable
							style={({ pressed }) => [
								styles.loginBtn,
								pressed && styles.loginBtnPressed,
							]}
							onPress={handleLogin}
						>
							<Text style={styles.loginBtnText}>Entrar</Text>
						</Pressable>
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>Novo por aqui? </Text>
						<Link href="/register" asChild>
							<Pressable>
								<Text style={styles.footerLink}>Criar conta</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
		gap: 24,
	},

	// Header
	header: {
		alignItems: "center",
		gap: 8,
	},
	iconWrapper: {
		width: 72,
		height: 72,
		borderRadius: 16,
		backgroundColor: COLORS.surface,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: COLORS.border,
		marginBottom: 8,
	},
	title: {
		fontSize: 40,
		fontStyle: "italic",
		fontWeight: "700",
		color: COLORS.green,
		letterSpacing: -1,
	},
	subtitle: {
		fontSize: 11,
		color: COLORS.textSecondary,
		letterSpacing: 3,
	},

	// Card
	card: {
		width: "100%",
		backgroundColor: COLORS.surface,
		borderRadius: 20,
		padding: 24,
		borderWidth: 1,
		borderColor: COLORS.border,
		gap: 20,
	},
	cardHeading: {
		gap: 4,
	},
	cardTitle: {
		fontSize: 26,
		fontWeight: "700",
		color: COLORS.textPrimary,
	},
	cardSubtitle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		lineHeight: 20,
	},

	// Fields
	fieldGroup: {
		gap: 8,
	},
	fieldLabel: {
		fontSize: 11,
		fontWeight: "600",
		color: COLORS.textSecondary,
		letterSpacing: 1.5,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.surfaceAlt,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: COLORS.border,
		paddingHorizontal: 14,
		height: 52,
		gap: 10,
	},
	inputWrapperFocused: {
		borderColor: COLORS.green,
	},
	input: {
		flex: 1,
		color: COLORS.textPrimary,
		fontSize: 15,
	},
	forgotBtn: {
		alignSelf: "flex-end",
	},
	forgotLink: {
		fontSize: 12,
		fontWeight: "600",
		color: COLORS.green,
	},

	// Login button
	loginBtn: {
		backgroundColor: COLORS.green,
		borderRadius: 10,
		height: 52,
		alignItems: "center",
		justifyContent: "center",
	},
	loginBtnPressed: {
		opacity: 0.85,
	},
	loginBtnText: {
		color: "#0d1117",
		fontSize: 16,
		fontWeight: "700",
	},

	// Footer
	footer: {
		flexDirection: "row",
		alignItems: "center",
	},
	footerText: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	footerLink: {
		fontSize: 14,
		color: COLORS.green,
		fontWeight: "600",
	},
});
