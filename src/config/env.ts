import { loadEnvFile } from "node:process";

// Im Container gibt es keine .env Datei, die Werte kommen von aussen
try {
    loadEnvFile();
} catch {
    console.log("Keine .env Datei gefunden, benutze Umgebungsvariablen");
}

export const usePrivateKey = () => {
    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) {
        throw new Error("JWT_SECRET fehlt in der .env");
    }
    return privateKey;
};

export const useDbConfig = () => {
    const host = process.env.DB_HOST;
    if (!host) {
        throw new Error("DB_HOST fehlt in der .env");
    }

    const port = process.env.DB_PORT;
    if (!port) {
        throw new Error("DB_PORT fehlt in der .env");
    }

    const user = process.env.DB_USER;
    if (!user) {
        throw new Error("DB_USER fehlt in der .env");
    }

    const password = process.env.DB_PASSWORD;
    if (!password) {
        throw new Error("DB_PASSWORD fehlt in der .env");
    }

    const database = process.env.DB_NAME;
    if (!database) {
        throw new Error("DB_NAME fehlt in der .env");
    }

    return {
        host: host,
        port: Number(port),
        user: user,
        password: password,
        database: database
    };
};