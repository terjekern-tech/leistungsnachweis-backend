// Koordinaten von Schaffhausen
const breitengrad = 47.7;
const laengengrad = 8.63;

// Holt die aktuelle Temperatur von Open-Meteo
export const holeTemperatur = async () => {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + breitengrad
        + "&longitude=" + laengengrad + "&current=temperature_2m";

    const antwort = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!antwort.ok) {
        return null;
    }

    const daten = await antwort.json();

    if (!daten.current) {
        return null;
    }

    return daten.current.temperature_2m;
};