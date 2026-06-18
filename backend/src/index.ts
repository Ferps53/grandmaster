import cors from "cors";
import express from "express";
import { db } from "./db";
import authRoutes from "./routes/auth";

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

app.get("/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
	res.status(404).json({ mensagem: "Rota não encontrada" });
});

db.conectar()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`✅ API rodando em http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Falha ao conectar no banco:", err);
		process.exit(1);
	});

export default app;
