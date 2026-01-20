# Quick Start Guide

Get your portfolio running in 5 minutes!

## 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

## 2. Setup Environment Variables

**Create `.env` file:**

```env
VITE_API_URL=http://localhost:5000
```

**Create `backend/.env` file:**

```env
# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/portfolio

# Email (use Resend or Gmail)
RESEND_API_KEY=your-resend-api-key
# OR Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Other config
PORT=5000
JWT_SECRET=your-secret-key-change-this
```

## 3. Start MongoDB

**Option A: Docker (Recommended)**

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: Local Installation**

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verify
mongosh
```

## 4. Run Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm start
# Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
npm run dev
# Frontend running on http://localhost:5173
```

## 5. Test It Out

1. Open http://localhost:5173
2. Go to Contact section
3. Fill out and submit the form
4. Check your email for confirmation

## 6. Deploy (Optional)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment guide.

---

**Issues? Check the [README.md](./README.md) troubleshooting section.**
