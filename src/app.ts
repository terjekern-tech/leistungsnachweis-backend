import express from "express";
import { createAuthRouter } from "./routes/auth.routes.ts";
export const createApp = () => {
    const app = express();

    app.use(express.json());

    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.use("/auth", createAuthRouter());

    return app;
};