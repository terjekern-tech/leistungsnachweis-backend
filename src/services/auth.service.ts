import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "../config/db.ts";
import { usePrivateKey } from "../config/env.ts";
import { registerSchema, loginSchema } from "../validation/auth.validation.ts";

export const register = async (req: any, res: any) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Ungueltige Daten" });
    }

    const username = result.data.username;

    const existing = await connection.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );

    if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Benutzername bereits vergeben" });
    }

    const passwordHash = await bcrypt.hash(result.data.password, 10);

    const created = await connection.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role, created_at",
        [username, passwordHash]
    );

    return res.status(201).json(created.rows[0]);
};

export const login = async (req: any, res: any) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Ungueltige Daten" });
    }

    const found = await connection.query(
        "SELECT * FROM users WHERE username = $1",
        [result.data.username]
    );

    const user = found.rows[0];

    if (!user) {
        return res.status(401).json({ error: "Login fehlgeschlagen" });
    }

    const passwordOk = await bcrypt.compare(result.data.password, user.password_hash);

    if (!passwordOk) {
        return res.status(401).json({ error: "Login fehlgeschlagen" });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        usePrivateKey(),
        { expiresIn: "1h" }
    );

    return res.status(200).json({ token: token });
};

export const me = async (req: any, res: any) => {
    const found = await connection.query(
        "SELECT id, username, role, created_at FROM users WHERE id = $1",
        [req.userId]
    );

    return res.status(200).json(found.rows[0]);
};