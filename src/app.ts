import express from "express";
import { createAuthRouter } from "./routes/auth.routes.ts";
import { createUserRouter } from "./routes/user.routes.ts";


export const createApp = () => {
    const app = express();

    app.use(express.json());

    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.use("/auth", createAuthRouter());
    app.use("/users", createUserRouter());
    return app;
};