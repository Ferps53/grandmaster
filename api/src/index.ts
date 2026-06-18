import cors from "cors";
import express from "express";
import authRoutes from "./features/auth/auth.routes";
import licoesRoutes from "./features/licoes/licoes.routes";
import { conectar } from "./shared/db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
	cors({
		origin: (
			process.env.CORS_ORIGIN ||
			"http://localhost:19000,http://localhost:8081,http://localhost:8082"
		).split(","),
		credentials: true,
	}),
);

app.use("/api/auth", authRoutes);
app.use("/api/licoes", licoesRoutes);

app.get("/health", (_req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
	res.status(404).json({ mensagem: "Rota não encontrada" });
});

conectar()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`✅ API rodando em http://localhost:${PORT}`);
		});
	})
	.catch((err: Error) => {
		console.error("Falha ao conectar no banco:", err);
		process.exit(1);
	});

export default app;
