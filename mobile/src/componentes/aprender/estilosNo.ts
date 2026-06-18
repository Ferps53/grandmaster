import { StyleSheet } from "react-native";

export const TAMANHO_NO = 68;

export const estilosNo = StyleSheet.create({
	wrapper: {
		width: "100%",
		height: 110,
		justifyContent: "center",
	},
	linha: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 24,
		gap: 12,
	},
	no: {
		width: TAMANHO_NO,
		height: TAMANHO_NO,
		borderRadius: 16,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		flex: 1,
		fontSize: 13,
		fontWeight: "600",
	},
});
