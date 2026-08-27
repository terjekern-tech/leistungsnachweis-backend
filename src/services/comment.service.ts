import { connection } from "../config/db.ts";
import { createCommentSchema } from "../validation/comment.validation.ts";

export const getComments = async (req: any, res: any) => {
    const postId = Number(req.params.id);

    const found = await connection.query(
        `SELECT comments.*, users.username AS author
         FROM comments
         JOIN users ON users.id = comments.user_id
         WHERE comments.post_id = $1
         ORDER BY comments.id`,
        [postId]
    );

    return res.status(200).json(found.rows);
};

export const createComment = async (req: any, res: any) => {
    const postId = Number(req.params.id);

    const result = createCommentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Ungueltige Daten" });
    }

    const post = await connection.query("SELECT id FROM posts WHERE id = $1", [postId]);

    if (!post.rows[0]) {
        return res.status(404).json({ error: "Post nicht gefunden" });
    }

    const created = await connection.query(
        "INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING *",
        [postId, req.userId, result.data.body]
    );

    return res.status(201).json(created.rows[0]);
};

export const deleteComment = async (req: any, res: any) => {
    const commentId = Number(req.params.id);

    const found = await connection.query(
        `SELECT comments.*, posts.user_id AS post_owner
         FROM comments
         JOIN posts ON posts.id = comments.post_id
         WHERE comments.id = $1`,
        [commentId]
    );

    const comment = found.rows[0];

    if (!comment) {
        return res.status(404).json({ error: "Kommentar nicht gefunden" });
    }

    const istAutor = comment.user_id === req.userId;
    const istPostBesitzer = comment.post_owner === req.userId;
    const istAdmin = req.userRole === "admin";

    if (!istAutor && !istPostBesitzer && !istAdmin) {
        return res.status(403).json({ error: "Keine Berechtigung" });
    }

    await connection.query("DELETE FROM comments WHERE id = $1", [commentId]);

    return res.status(200).json({ message: "Kommentar geloescht" });
};