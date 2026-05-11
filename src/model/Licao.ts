import type MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";

type NomesIcone = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type StatusLicao =
	| "concluida"
	| "atual"
	| "bloqueada"
	| "recompensa"
	| "recompensa_recebida";

export type Licao = {
	id: string;
	titulo: string;
	status: StatusLicao;
	icone: NomesIcone;
	offset: number;
};
