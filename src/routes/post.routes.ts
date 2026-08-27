import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../services/post.service.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

export const createPostRouter = () => {
    const postRouter = Router();

    postRouter.get("/", requireAuth, getPosts);
    postRouter.get("/:id", requireAuth, getPostById);
    postRouter.post("/", requireAuth, createPost);
    postRouter.patch("/:id", requireAuth, updatePost);
    postRouter.delete("/:id", requireAuth, deletePost);

    return postRouter;
};