import { Router } from "express";
import { licoesController } from "../controllers/licoesController";
import { verificarToken } from "../middleware/auth";

const router = Router();

router.use(verificarToken);

router.get("/", licoesController.listar);
router.get("/:id", licoesController.buscarPorId);
router.post("/:id/concluir", licoesController.concluir);

export default router;
