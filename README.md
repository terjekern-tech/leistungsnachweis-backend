# Community Feed API

Backend für eine kleine Community-Plattform. User registrieren sich,
schreiben Posts und kommentieren sie. Beim Erstellen von einem Post wird
die aktuelle Temperatur von einer externen API mitgespeichert.

## Setup

Man braucht nur Docker Desktop.

1. Repo klonen
2. `.env` erstellen, Vorlage ist `.env.example`
3. `docker compose up -d`

Läuft dann auf Port 3000. Die Tabellen werden beim Start automatisch aus
`src/schema.sql` angelegt. Zum Prüfen: `GET localhost:3000/health`

## API

POST /auth/register
POST /auth/login
GET /auth/me

GET /users
GET /posts?limit=10&offset=0
GET /posts/:id
POST /posts
PATCH /posts/:id
DELETE /posts/:id
GET /posts/:id/comments
POST /posts/:id/comments
DELETE /comments/:id
GET /health

Alles ausser register, login und health braucht einen Bearer Token.

## Entscheidungen

**PostgreSQL statt MySQL** - hatte ich im letzten Projekt schon. Prepared
Statements gehen gleich, nur mit `$1` statt `?`.

**Open-Meteo statt Link-Anreicherung** - das Wetter von gestern kann man
später nicht mehr nachschauen, deshalb hole ich es direkt beim Erstellen.
Timeout 5 Sekunden. Antwortet die API nicht, wird der Post trotzdem
gespeichert und `weather_status` steht auf `failed`.

**Berechtigungen** - Posts darf nur der Autor oder ein Admin ändern und
löschen. Kommentare zusätzlich der, dem der Post gehört.

**user_id und role kommen aus dem Token** - stehen in keinem Zod-Schema,
sonst könnte sich jeder zum Admin machen.

**Rate Limit nur beim Login** - dort kann man Passwörter durchprobieren.
Sonst braucht man sowieso einen Token.

**Fehler** - immer `{ "error": "..." }`. 400 falscher Body, 401 kein
Token, 403 fremde Sachen, 404 gibt es nicht.

## KI-Einsatz

Ich habe Claude vor allem für die Datenbank-Sachen im Code gebraucht, also
die SQL-Abfragen und die JOINs, damit beim Post auch der Name vom Autor
mitkommt. Beim Docker-Setup hat es mir auch geholfen. Danach bin ich den
Code durchgegangen und habe umgeschrieben, was ich nicht erklären konnte.

## Nicht umgesetzt und wie ich es angehen würde

**Bild-Upload**

Hätte ich mit multer gemacht. Den Dateinamen würde der Server selbst
erzeugen, damit der Client keinen mitgeben kann. Dazu eine Prüfung, ob es
wirklich ein Bild ist, und ein Limit bei der Grösse. In der Tabelle würde
nur der Dateiname stehen, die Datei selbst liegt im Ordner.

**Direktnachrichten**

Wer die Nachricht schickt, würde ich aus dem Token nehmen und nicht aus dem
Body. Beim Lesen würde ich schauen, ob der eingeloggte User Sender oder
Empfänger ist. Wenn nicht, gibt es 403.

**Cronjob**

Mit `node-cron`, den man über die `.env` ausschalten kann. Er hätte bei
Posts mit `weather_status = 'failed'` das Wetter nochmal geholt und ins Log
geschrieben, bei wie vielen es geklappt hat.

**Tests**

Jest und Supertest hatte ich eingerichtet, es lief aber nicht sauber mit
meiner TypeScript-Version. Testen würde ich die Stellen, wo mein Backend
Anfragen ablehnt: ohne Token, bei falschem Body und bei fremden Posts.

Bei allen Punkten hätte ich die genaue Schreibweise in der jeweiligen Doku
nachgeschaut, den Aufbau kenne ich aber vom Unterricht und aus meinem
anderen Projekt.

Die Zeit habe ich stattdessen gebraucht, um bei Auth, Posts und Kommentaren
alle Fehlerfälle sauber zu machen und alles in Postman durchzutesten.
