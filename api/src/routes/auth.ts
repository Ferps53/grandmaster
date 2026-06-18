import { Router } from "express";
import { authController } from "../controllers/authController";
import { verificarToken } from "../middleware/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/cadastro", authController.cadastro);
router.get("/verificar", verificarToken, authController.verificar);

export default router;
