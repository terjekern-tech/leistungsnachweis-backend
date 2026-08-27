import { Pool } from "pg";
import { readFileSync } from "fs";
import { useDbConfig } from "./env.ts";

export const connection = new Pool(useDbConfig());

// Liest schema.sql und legt die Tabellen an
export const initDb = async () => {
    const sql = readFileSync("src/schema.sql", "utf-8");
    await connection.query(sql);
    console.log("Tabellen sind bereit");
};