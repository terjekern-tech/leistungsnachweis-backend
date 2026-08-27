import { Router } from "express";
import { register, login, me } from "../services/auth.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { rateLimit } from "../middleware/rateLimit.middleware.ts";

export const createAuthRouter = () => {
    const authRouter = Router();

    authRouter.post("/register", register);
    authRouter.post("/login", rateLimit, login);
    authRouter.get("/me", requireAuth, me);

    return authRouter;
};