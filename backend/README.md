# Digital Shop Backend

Node + Express backend using Prisma + SQLite for contact messages and customer accounts.

Endpoints:

- `GET /api/health` — health check
- `POST /api/messages` — create a message `{ name, email, message, phone? }`
- `POST /api/contact` — same as `/api/messages` (kept for frontend compatibility)
- `GET /api/messages` — list messages
- `POST /api/auth/register` — create an account `{ name?, email, password }`, returns `{ token, user }`
- `POST /api/auth/login` — `{ email, password }`, returns `{ token, user }`
- `GET /api/auth/me` — returns the current user for a valid `Authorization: Bearer <token>` header

Setup (from `backend`):

```bash
npm install
npx prisma db push
npx prisma generate
npm start
```

Requires `DATABASE_URL` and `JWT_SECRET` in `backend/.env` (see `.env` for local dev values — `JWT_SECRET` should be a long random string in any real deployment).
