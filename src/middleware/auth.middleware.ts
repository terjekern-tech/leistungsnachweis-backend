import jwt from "jsonwebtoken";
import { usePrivateKey } from "../config/env.ts";

export const requireAuth = (req: any, res: any, next: any) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: "Kein Token" });
    }

    const token = header.replace("Bearer ", "");

    try {
        const payload: any = jwt.verify(token, usePrivateKey());
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    } catch {
        return res.status(401).json({ error: "Token ungueltig" });
    }
};