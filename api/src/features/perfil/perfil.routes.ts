import { Router } from "express";
import { verificarToken } from "../../shared/middleware/auth";
import { perfilController } from "./perfil.controller";

const router = Router();

router.use(verificarToken);

router.get("/", perfilController.obter);

export default router;
