# Digital Shop

A small storefront for selling digital products (templates, guides, scripts, snippet packs). The app started life as a developer portfolio — the Home page still carries portfolio sections (Hero, About, Skills, Contact) — and was converted into a shop by adding a product catalog, cart, and checkout flow on top of it.

This README describes what the code actually does today, including the parts that are still mocked/UI-only, so it doesn't drift from reality like the previous version of this doc did.

## Tech Stack

**Frontend** — `src/`

- React 18 + TypeScript, built with Vite
- Tailwind CSS for styling, Framer Motion for animation
- React Router (`react-router-dom`) for routing
- Cart state via a simple React Context (`src/context/CartContext.tsx`) — in-memory only, not persisted

**Backend** — `backend/`

- Express server (`backend/server.js`)
- Prisma ORM against a local **SQLite** database (`backend/prisma/dev.db`)
- No auth, no JWT, no email provider — the backend's only job right now is storing contact messages

## Project Structure

```
.
├── src/
│   ├── components/        # Navigation, Hero, About, Skills, Contact, ProductCard, ProductModal, ...
│   ├── pages/              # Home, Shop, Checkout, SignIn, AdminLogin, AdminDashboard
│   ├── context/
│   │   └── CartContext.tsx # add/remove/clear cart items, compute total
│   ├── data/
│   │   └── products.ts     # static product catalog (id, slug, title, price, fileUrl, category)
│   └── main.tsx
├── backend/
│   ├── prisma/schema.prisma # single `Message` model
│   ├── server.js             # Express app: /api/health, /api/messages
│   └── README.md
└── public/products/          # placeholder product images + downloadable files
```

## Routes

| Route              | Page             | What it actually does                                                                 |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------- |
| `/`                 | Home             | Portfolio-style Hero/About/Skills sections + the Contact form                          |
| `/shop`             | Shop             | Browse/search/filter the static product catalog, add items to cart                     |
| `/checkout`         | Checkout         | Review cart, "Complete Purchase (Mock)" — **no real payment**, immediately reveals static download links from `public/products/` |
| `/signin`           | SignIn           | **Mock auth** — stores an email in `localStorage`, no backend call, no real accounts    |
| `/admin/login`      | AdminLogin       | UI calls `POST /api/auth/login` — **this endpoint does not exist in the current backend** |
| `/admin/dashboard`  | AdminDashboard   | UI calls `GET /api/admin/stats`, `GET /api/admin/messages`, etc. — **these endpoints do not exist in the current backend** |

## Backend Reality Check

The current backend (`backend/server.js`) only exposes:

- `GET /api/health` — health check
- `POST /api/messages` — create a message `{ name, email, message }`
- `GET /api/messages` — list messages, newest first

Backed by one Prisma model:

```prisma
model Message {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

**Known mismatch:** the Contact form (`src/components/Contact.tsx`) posts to `POST /api/contact`, but the backend only implements `POST /api/messages`. Submitting the contact form against this backend will fail (404) until either the frontend is pointed at `/api/messages` or a matching `/api/contact` route is added.

The admin login/dashboard pages, JWT auth, MongoDB, email sending (Resend/Nodemailer), and user accounts described in older docs (`BACKEND_SETUP.md`, `DEPLOYMENT.md`, `MONGODB_SETUP.md`, etc.) are **not implemented** by the current backend — those pages are UI shells left over from an earlier iteration of the project.

## Running Locally

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies & set up the database

```bash
cd backend
npm install
npx prisma db push      # creates dev.db from schema.prisma
npx prisma generate
cd ..
```

### 3. Environment variables

**Frontend** (`.env`)

```env
VITE_API_URL=http://localhost:4000
```

**Backend** (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

> Note: `server.js` defaults to port `4000` if `PORT` isn't set — make sure `VITE_API_URL` matches whatever port the backend actually starts on.

### 4. Start both apps

```bash
# Terminal 1
cd backend
npm start        # or: npm run dev (nodemon)

# Terminal 2
npm run dev
```

Visit `http://localhost:5173`.

## Build

```bash
npm run build     # installs dev deps, runs tsc, then vite build -> dist/
npm run preview   # serve the production build locally
```

## Product Catalog

Products are hardcoded in [`src/data/products.ts`](src/data/products.ts) — there's no products table or admin UI to manage them. Adding/editing a product means editing that file directly and dropping the matching image/download file into `public/products/`.

## Known Gaps

These are real limitations of the app as it stands, not bugs to "fix" blindly — worth knowing before building on top of them:

- **No real payments.** Checkout is a mocked timeout that immediately unlocks download links.
- **No real user accounts.** SignIn only writes to `localStorage`.
- **Admin dashboard is disconnected.** It expects auth/admin API routes that don't exist yet.
- **Cart doesn't persist.** Refreshing the page clears it (in-memory Context state only).
- **Contact form endpoint mismatch.** See "Backend Reality Check" above.

## License

MIT
