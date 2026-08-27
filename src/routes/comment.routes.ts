import { Router } from "express";
import { deleteComment } from "../services/comment.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createCommentRouter = () => {
    const commentRouter = Router();

    /**
     * @openapi
     * /comments/{id}:
     *   delete:
     *     summary: Einen eigenen Kommentar löschen
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
     *         example: 5
     *     responses:
     *       200:
     *         description: Kommentar erfolgreich gelöscht
     *       401:
     *         description: Kein oder ungültiger Token
     *       403:
     *         description: Kommentar gehört einem anderen Benutzer
     *       404:
     *         description: Kommentar nicht gefunden
     */
    commentRouter.delete("/:id", requireAuth, deleteComment);

    return commentRouter;
};
