import { connection } from "../config/db.ts";
import { createPostSchema, updatePostSchema } from "../validation/post.validation.ts";
import { holeTemperatur } from "./weather.service.ts";

export const getPosts = async (req: any, res: any) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const found = await connection.query(
        `SELECT posts.*, users.username AS author
         FROM posts
         JOIN users ON users.id = posts.user_id
         ORDER BY posts.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    return res.status(200).json(found.rows);
};

export const getPostById = async (req: any, res: any) => {
    const postId = Number(req.params.id);

    const found = await connection.query(
        `SELECT posts.*, users.username AS author
         FROM posts
         JOIN users ON users.id = posts.user_id
         WHERE posts.id = $1`,
        [postId]
    );

    const post = found.rows[0];

    if (!post) {
        return res.status(404).json({ error: "Post nicht gefunden" });
    }

    const comments = await connection.query(
        `SELECT comments.*, users.username AS author
         FROM comments
         JOIN users ON users.id = comments.user_id
         WHERE comments.post_id = $1
         ORDER BY comments.id`,
        [postId]
    );

    post.comments = comments.rows;
    

    return res.status(200).json(post);
};

export const createPost = async (req: any, res: any) => {
    const result = createPostSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Ungueltige Daten" });
    }

    let temperatur = null;

    try {
        temperatur = await holeTemperatur();
    } catch {
        console.log("Wetter-API nicht erreichbar");
    }

    if (temperatur === null) {
        const created = await connection.query(
            "INSERT INTO posts (user_id, title, body, weather_status) VALUES ($1, $2, $3, 'failed') RETURNING *",
            [req.userId, result.data.title, result.data.body]
        );

        return res.status(201).json(created.rows[0]);
    }

    const created = await connection.query(
        `INSERT INTO posts (user_id, title, body, weather_temperature, weather_status, weather_fetched_at)
         VALUES ($1, $2, $3, $4, 'ok', NOW()) RETURNING *`,
        [req.userId, result.data.title, result.data.body, temperatur]
    );

    return res.status(201).json(created.rows[0]);
};

export const updatePost = async (req: any, res: any) => {
    const postId = Number(req.params.id);

    const result = updatePostSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Ungueltige Daten" });
    }

    const found = await connection.query("SELECT * FROM posts WHERE id = $1", [postId]);
    const post = found.rows[0];

    if (!post) {
        return res.status(404).json({ error: "Post nicht gefunden" });
    }

    if (post.user_id !== req.userId && req.userRole !== "admin") {
        return res.status(403).json({ error: "Keine Berechtigung" });
    }

    const newTitle = result.data.title || post.title;
    const newBody = result.data.body || post.body;

    const updated = await connection.query(
        "UPDATE posts SET title = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
        [newTitle, newBody, postId]
    );

    return res.status(200).json(updated.rows[0]);
};

export const deletePost = async (req: any, res: any) => {
    const postId = Number(req.params.id);

    const found = await connection.query("SELECT * FROM posts WHERE id = $1", [postId]);
    const post = found.rows[0];

    if (!post) {
        return res.status(404).json({ error: "Post nicht gefunden" });
    }

    if (post.user_id !== req.userId && req.userRole !== "admin") {
        return res.status(403).json({ error: "Keine Berechtigung" });
    }

    await connection.query("DELETE FROM posts WHERE id = $1", [postId]);

    return res.status(200).json({ message: "Post geloescht" });
};