const requests: any = {};

// Erlaubt 5 Anfragen pro IP innerhalb einer Minute
export const rateLimit = (req: any, res: any, next: any) => {
    const ip = req.ip;
    const jetzt = Date.now();

    if (!requests[ip]) {
        requests[ip] = [];
    }

    requests[ip] = requests[ip].filter((zeit: number) => jetzt - zeit < 60000);

    if (requests[ip].length >= 5) {
        return res.status(429).json({ error: "Zu viele Anfragen" });
    }

    requests[ip].push(jetzt);
    next();
};