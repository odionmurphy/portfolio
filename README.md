# Digital Shop

A small storefront for selling digital products (templates, guides, scripts, snippet packs). The app started life as a developer portfolio and was converted into a shop: the portfolio Home page was replaced with a product-focused one (hero banner, category grid, product grid, account card), a global Shop-branded footer was added, and the unused portfolio components (`Hero`, `About`, `Skills`, `Contact`, `Portfolio`, `ProjectCard`/`ProjectModal`, `CursorSmoke`, `TorchLight`, `src/data/projects.ts`, and their associated images) were deleted rather than left as dead code — see "Known Gaps" for what that means for a contact form.

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
- Real customer auth: register/login with bcrypt-hashed passwords and JWTs
- No email provider — contact messages are just stored, not emailed anywhere

## Project Structure

```
.
├── src/
│   ├── components/        # Navigation, ProductCard, ProductModal, Footer, ...
│   ├── pages/              # Home, Shop, Checkout, SignIn, SignUp, AdminLogin, AdminDashboard
│   ├── context/
│   │   └── CartContext.tsx # add/remove/clear cart items, compute total
│   ├── lib/
│   │   └── auth.ts         # session storage + API URL helper shared by SignIn/SignUp/Navigation
│   ├── data/
│   │   └── products.ts     # static product catalog (id, slug, title, price, fileUrl, category)
│   └── main.tsx
├── backend/
│   ├── prisma/schema.prisma # `Message` and `User` models
│   ├── server.js             # Express app: health, messages/contact, auth
│   └── README.md
└── public/products/          # placeholder product images + downloadable files
```

## Routes

| Route              | Page             | What it actually does                                                                 |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------- |
| `/`                 | Home             | Hero banner, a "Shop by Category" grid, a "Popular Products" grid, value-prop band, and an account card that reflects real sign-in state |
| `/shop`             | Shop             | Browse/search/filter the static product catalog, add items to cart                     |
| `/checkout`         | Checkout         | Review cart, "Complete Purchase (Mock)" — **no real payment**, immediately reveals static download links from `public/products/` |
| `/signin`           | SignIn           | Real login against `POST /api/auth/login` — hashed password check, returns a JWT          |
| `/signup`           | SignUp           | Real registration against `POST /api/auth/register` — creates a `User` row, returns a JWT |
| `/admin/login`      | AdminLogin       | UI calls `POST /api/auth/login` with an `isAdmin` check the current `User` model doesn't have — **not wired up, don't confuse this with customer sign-in** |
| `/admin/dashboard`  | AdminDashboard   | UI calls `GET /api/admin/stats`, `GET /api/admin/messages`, etc. — **these endpoints do not exist in the current backend** |

`Navigation` and `Footer` render on every route (outside `<Routes>` in `App.tsx`), not just Home.

## Backend Reality Check

The current backend (`backend/server.js`) exposes:

- `GET /api/health` — health check
- `POST /api/messages` and `POST /api/contact` — both create a message `{ name, email, message, phone? }` (`/api/contact` is kept in case a contact form gets built later; the frontend that used to post there was deleted along with the rest of the unused portfolio code)
- `GET /api/messages` — list messages, newest first
- `POST /api/auth/register` — `{ name?, email, password }` → creates a `User`, returns `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → returns `{ token, user }`
- `GET /api/auth/me` — returns the current user for a valid `Authorization: Bearer <token>`

Backed by two Prisma models:

```prisma
model Message {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  phone     String?
  message   String
  createdAt DateTime @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  name      String?
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

**Still not implemented:** admin auth (`isAdmin` flag, admin-only stats/messages endpoints), MongoDB, email sending (Resend/Nodemailer) described in older docs (`BACKEND_SETUP.md`, `DEPLOYMENT.md`, `MONGODB_SETUP.md`, etc.). `AdminLogin`/`AdminDashboard` remain UI shells left over from an earlier iteration of the project — they'll hit the real `/api/auth/login` endpoint now, but every login will be rejected since `User` has no `isAdmin` field.

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
JWT_SECRET="a-long-random-string"   # required — used to sign auth tokens
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
- **Sign-in isn't tied to a purchase history.** Accounts are real, but nothing in Shop/Checkout checks who's logged in yet — there's no per-user order history.
- **Admin dashboard is disconnected.** It expects `isAdmin`/admin-only API routes that don't exist yet.
- **Cart doesn't persist.** Refreshing the page clears it (in-memory Context state only).
- **No contact form.** The old `Contact.tsx` component was deleted along with the rest of the unused portfolio code — if you want a contact form, it needs to be built into the shop's design, not resurrected from the portfolio version.

## License

MIT
