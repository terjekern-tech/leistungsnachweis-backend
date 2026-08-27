import { createApp } from "./app.ts";
import { initDb } from "./config/db.ts";

await initDb();

createApp().listen(3000, () => console.log("Server läuft auf Port 3000"));