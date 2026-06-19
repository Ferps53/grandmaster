import { Router } from "express";
import { verificarToken } from "../../shared/middleware/auth";
import { puzzlesController } from "./puzzles.controller";

const router = Router();

router.use(verificarToken);

router.get("/proximo", puzzlesController.proximo);
router.post("/:id/resultado", puzzlesController.submeterResultado);
router.get("/historico", puzzlesController.historico);

export default router;
