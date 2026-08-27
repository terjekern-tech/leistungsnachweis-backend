import { connection } from "../config/db.ts";

export const getUsers = async (req: any, res: any) => {
    const found = await connection.query(
        "SELECT id, username, role, created_at FROM users ORDER BY id"
    );

    return res.status(200).json(found.rows);
};