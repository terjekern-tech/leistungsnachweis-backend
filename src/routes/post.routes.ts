import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../services/post.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { getComments, createComment } from "../services/comment.service.ts";

export const createPostRouter = () => {
    const postRouter = Router();

    /**
     * @openapi
     * /posts:
     *   get:
     *     summary: Alle Posts abrufen
     *     tags:
     *       - Posts
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste aller Posts
     *       401:
     *         description: Kein oder ungültiger Token
     */
    postRouter.get("/", requireAuth, getPosts);

    /**
     * @openapi
     * /posts/{id}:
     *   get:
     *     summary: Einen Post anhand der ID abrufen
     *     tags:
     *       - Posts
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Der gefundene Post
     *       401:
     *         description: Kein oder ungültiger Token
     *       404:
     *         description: Post nicht gefunden
     */
    postRouter.get("/:id", requireAuth, getPostById);

    /**
     * @openapi
     * /posts:
     *   post:
     *     summary: Neuen Post erstellen
     *     tags:
     *       - Posts
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - content
     *             properties:
     *               title:
     *                 type: string
     *                 example: Mein erster Post
     *               content:
     *                 type: string
     *                 example: Das ist der Inhalt.
     *     responses:
     *       201:
     *         description: Post erfolgreich erstellt
     *       400:
     *         description: Ungültiger Body
     *       401:
     *         description: Kein oder ungültiger Token
     */
    postRouter.post("/", requireAuth, createPost);

    /**
     * @openapi
     * /posts/{id}:
     *   patch:
     *     summary: Einen eigenen Post aktualisieren
     *     tags:
     *       - Posts
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 example: Neuer Titel
     *               content:
     *                 type: string
     *                 example: Neuer Inhalt
     *     responses:
     *       200:
     *         description: Post erfolgreich aktualisiert
     *       400:
     *         description: Ungültiger Body
     *       401:
     *         description: Kein oder ungültiger Token
     *       403:
     *         description: Post gehört einem anderen Benutzer
     *       404:
     *         description: Post nicht gefunden
     */
    postRouter.patch("/:id", requireAuth, updatePost);

    /**
     * @openapi
     * /posts/{id}:
     *   delete:
     *     summary: Einen eigenen Post löschen
     *     tags:
     *       - Posts
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Post erfolgreich gelöscht
     *       401:
     *         description: Kein oder ungültiger Token
     *       403:
     *         description: Post gehört einem anderen Benutzer
     *       404:
     *         description: Post nicht gefunden
     */
    postRouter.delete("/:id", requireAuth, deletePost);

    /**
     * @openapi
     * /posts/{id}/comments:
     *   get:
     *     summary: Alle Kommentare eines Posts abrufen
     *     tags:
     *       - Comments
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Liste der Kommentare
     *       401:
     *         description: Kein oder ungültiger Token
     *       404:
     *         description: Post nicht gefunden
     */
    postRouter.get("/:id/comments", requireAuth, getComments);

    /**
     * @openapi
     * /posts/{id}/comments:
     *   post:
     *     summary: Neuen Kommentar zu einem Post hinzufügen
     *     tags:
     *       - Comments
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - content
     *             properties:
     *               content:
     *                 type: string
     *                 example: Toller Post!
     *     responses:
     *       201:
     *         description: Kommentar erfolgreich erstellt
     *       400:
     *         description: Ungültiger Body
     *       401:
     *         description: Kein oder ungültiger Token
     *       404:
     *         description: Post nicht gefunden
     */
    postRouter.post("/:id/comments", requireAuth, createComment);

    return postRouter;
};
