import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1)
});

export const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional()
});