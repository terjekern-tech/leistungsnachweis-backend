import { Router } from "express";
import { getUsers } from "../services/user.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createUserRouter = () => {
    const userRouter = Router();

    /**
     * @openapi
     * /users:
     *   get:
     *     summary: Alle Benutzer abrufen
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste aller Benutzer
     *       401:
     *         description: Kein oder ungültiger Token
     */
    userRouter.get("/", requireAuth, getUsers);

    return userRouter;
};
