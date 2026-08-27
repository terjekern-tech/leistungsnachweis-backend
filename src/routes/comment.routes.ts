import { Router } from "express";
import { deleteComment } from "../services/comment.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createCommentRouter = () => {
    const commentRouter = Router();

    commentRouter.delete("/:id", requireAuth, deleteComment);

    return commentRouter;
};