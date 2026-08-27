import { Router } from "express";
import { register, login, me } from "../services/auth.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { rateLimit } from "../middleware/rateLimit.middleware.ts";

export const createAuthRouter = () => {
    const authRouter = Router();

    /**
     * @openapi
     * /auth/register:
     *   post:
     *     summary: Neuen Benutzer registrieren
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: max
     *               email:
     *                 type: string
     *                 example: max@example.com
     *               password:
     *                 type: string
     *                 example: geheim123
     *     responses:
     *       201:
     *         description: Benutzer erfolgreich erstellt
     *       400:
     *         description: Ungültiger Body (z.B. fehlende Felder)
     */
    authRouter.post("/register", register);

    /**
     * @openapi
     * /auth/login:
     *   post:
     *     summary: Einloggen und JWT erhalten
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: max@example.com
     *               password:
     *                 type: string
     *                 example: geheim123
     *     responses:
     *       200:
     *         description: Login erfolgreich, JWT im Body
     *       400:
     *         description: Ungültiger Body
     *       401:
     *         description: E-Mail oder Passwort falsch
     */
    authRouter.post("/login", rateLimit, login);

    /**
     * @openapi
     * /auth/me:
     *   get:
     *     summary: Eigenes Profil abrufen
     *     tags:
     *       - Auth
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profil des eingeloggten Benutzers
     *       401:
     *         description: Kein oder ungültiger Token
     */
    authRouter.get("/me", requireAuth, me);

    return authRouter;
};
