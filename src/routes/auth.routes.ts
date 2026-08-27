import { Router } from "express";
import { register, login, me } from "../services/auth.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createAuthRouter = () => {
    const authRouter = Router();

    authRouter.post("/register", register);
    authRouter.post("/login", login);
    authRouter.get("/me", requireAuth, me);

    return authRouter;
};