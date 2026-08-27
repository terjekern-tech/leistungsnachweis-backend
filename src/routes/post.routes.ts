import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../services/post.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { getComments, createComment } from "../services/comment.service.ts";
export const createPostRouter = () => {
    const postRouter = Router();

    postRouter.get("/", requireAuth, getPosts);
    postRouter.get("/:id", requireAuth, getPostById);
    postRouter.post("/", requireAuth, createPost);
    postRouter.patch("/:id", requireAuth, updatePost);
    postRouter.delete("/:id", requireAuth, deletePost);
    postRouter.get("/:id/comments", requireAuth, getComments);
    postRouter.post("/:id/comments", requireAuth, createComment);
    return postRouter;
};