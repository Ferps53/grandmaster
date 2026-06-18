import { Router } from "express";
import { verificarToken } from "../../shared/middleware/auth";
import { licoesController } from "./licoes.controller";

const router = Router();

router.use(verificarToken);

router.get("/", licoesController.listar);
router.get("/:id", licoesController.buscarPorId);
router.post("/:id/concluir", licoesController.concluir);

export default router;
