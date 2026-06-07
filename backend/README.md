# Portfolio Backend

Simple Node + Express backend using Prisma + SQLite for storing contact messages.

Endpoints:

- `POST /api/messages` — create a message { name, email, message }
- `GET /api/messages` — list messages

Setup (from `backend`):

```bash
npm install
npx prisma db push
npx prisma generate
npm start
```
