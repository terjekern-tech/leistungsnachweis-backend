import { Router } from "express";
import { getUsers } from "../services/user.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createUserRouter = () => {
    const userRouter = Router();

    userRouter.get("/", requireAuth, getUsers);

    return userRouter;
};