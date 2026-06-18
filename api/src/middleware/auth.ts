import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
	id: string;
	email: string;
	nome: string;
}

declare global {
	namespace Express {
		interface Request {
			usuario?: TokenPayload;
		}
	}
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function gerarToken(usuario: {
	id: string;
	email: string;
	nome: string;
}): string {
	return jwt.sign(usuario, JWT_SECRET, { expiresIn: "30d" });
}

export function verificarToken(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ mensagem: "Token não fornecido" });
		return;
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
		req.usuario = payload;
		next();
	} catch (erro) {
		res.status(401).json({ mensagem: "Token inválido ou expirado" });
	}
}
