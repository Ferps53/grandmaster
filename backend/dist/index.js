"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        const origensPermitidas = (process.env.CORS_ORIGIN || "http://localhost:19000").split(",").map((o) => o.trim());
        if (origensPermitidas.includes(origin)) {
            callback(null, true);
            return;
        }
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Origin nao permitida pelo CORS"));
    },
    credentials: true,
}));
// Routes
app.use("/api/auth", auth_1.default);
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
exports.default = app;
