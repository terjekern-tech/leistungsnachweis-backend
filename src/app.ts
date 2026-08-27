import express from "express";
import swaggerUi from "swagger-ui-express";
import { createAuthRouter } from "./routes/auth.routes.ts";
import { createUserRouter } from "./routes/user.routes.ts";
import { createPostRouter } from "./routes/post.routes.ts";
import { createCommentRouter } from "./routes/comment.routes.ts";
import { swaggerSpec } from "./config/swagger.ts";

export const createApp = () => {
    const app = express();

    app.use(express.json());

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.use("/auth", createAuthRouter());
    app.use("/users", createUserRouter());
    app.use("/posts", createPostRouter());
    app.use("/comments", createCommentRouter());
    return app;
};