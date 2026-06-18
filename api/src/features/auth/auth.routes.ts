import { Router } from "express";
import { verificarToken } from "../../shared/middleware/auth";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.login);
router.post("/cadastro", authController.cadastro);
router.get("/verificar", verificarToken, authController.verificar);

export default router;
