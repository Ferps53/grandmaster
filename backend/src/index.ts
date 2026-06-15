import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
	origin: (process.env.CORS_ORIGIN || "http://localhost:19000").split(","),
	credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
	res.status(404).json({ mensagem: "Rota não encontrada" });
});

// Start server
app.listen(PORT, () => {
	console.log(`✅ API rodando em http://localhost:${PORT}`);
});

export default app;
