# Backend Setup Summary

## What Has Been Created

Your portfolio app now has a complete full-stack backend with database integration!

### ✅ Backend Components Created

**Database Layer:**

- ✓ MongoDB integration with Mongoose
- ✓ User model with password hashing (bcryptjs)
- ✓ Contact message model with read/reply tracking
- ✓ Database configuration file

**API Routes:**

- ✓ Authentication routes (register, login, me)
- ✓ Contact form endpoints (submit, list, reply, delete)
- ✓ Health check endpoint
- ✓ JWT-based authorization

**Middleware & Utilities:**

- ✓ Auth middleware for protected routes
- ✓ Email service (supports Resend or Nodemailer)
- ✓ Request validation
- ✓ Error handling

**Configuration:**

- ✓ Express.js server setup with CORS
- ✓ Environment variable management
- ✓ Docker configuration for containerization
- ✓ MongoDB Atlas support

### ✅ Frontend Enhancements

- ✓ Updated Contact form with phone field
- ✓ Environment variable support for API URL
- ✓ Dynamic API endpoint configuration

### ✅ Documentation & Deployment

- ✓ Comprehensive README with setup instructions
- ✓ Detailed DEPLOYMENT.md guide
- ✓ QUICKSTART.md for quick setup
- ✓ .gitignore for GitHub
- ✓ Docker setup for local testing

---

## Directory Structure

```
portfolio-01/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema with auth
│   │   └── Contact.js           # Contact message schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── contact.js           # Contact endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── utils/
│   │   └── email.js             # Email service
│   ├── server.js                # Express app
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables
│   ├── Dockerfile               # Container configuration
│   └── .dockerignore            # Docker ignore patterns
│
├── src/
│   ├── components/
│   │   └── Contact.tsx          # Updated with phone field
│   └── ...
│
├── docker-compose.yml           # MongoDB + Backend services
├── .env                         # Frontend config
├── .env.example                 # Example variables
├── .gitignore                   # Git ignore patterns
├── package.json                 # Frontend dependencies
├── README.md                    # Full documentation
├── DEPLOYMENT.md                # Deployment guide
├── QUICKSTART.md                # Quick start guide
└── ...
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register    - Create new account
POST   /api/auth/login       - Login user (returns JWT)
GET    /api/auth/me          - Get current user (requires token)
```

### Contact Messages

```
POST   /api/contact              - Submit contact form (public)
GET    /api/contact              - List all messages (admin only)
GET    /api/contact/:id          - Get single message (admin only)
PUT    /api/contact/:id/reply    - Reply to message (admin only)
DELETE /api/contact/:id          - Delete message (admin only)
```

### Health

```
GET    /api/health           - API health status
```

---

## Database Schemas

### User Model

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  name: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model

```javascript
{
  name: String,
  email: String,
  phone: String (optional),
  message: String,
  isRead: Boolean,
  isReplied: Boolean,
  replyMessage: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## How to Get Started

### 1. Quick Local Setup (5 minutes)

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Create backend/.env
cat > backend/.env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/portfolio
RESEND_API_KEY=your-resend-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=5000
JWT_SECRET=change-this-in-production
FRONTEND_URL=http://localhost:5173
EOF

# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)
npm run dev
```

Visit http://localhost:5173 and test the contact form!

### 2. Configure Email

Choose one option:

**Option A: Resend (Recommended)**

1. Sign up at https://resend.com
2. Get API key
3. Set `RESEND_API_KEY` in backend/.env

**Option B: Gmail**

1. Enable 2FA on Google account
2. Generate App Password
3. Set in backend/.env:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### 3. Deploy to Production

Follow [DEPLOYMENT.md](./DEPLOYMENT.md):

1. Push to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Set up MongoDB Atlas
5. Configure environment variables

---

## Key Features

✨ **User Authentication**

- Register/Login functionality
- Password hashing with bcryptjs
- JWT token-based auth
- Protected admin endpoints

✨ **Contact Management**

- Public contact form submission
- Auto email confirmations
- Admin message dashboard
- Reply tracking system
- Message history

✨ **Email Notifications**

- Confirmation emails to users
- Admin notifications on new messages
- Reply emails with custom messages
- Support for multiple email services

✨ **Database**

- MongoDB integration
- Mongoose ODM for schema validation
- Automated timestamps
- Indexing for performance

✨ **Deployment Ready**

- Docker containerization
- Environment variable configuration
- Render & Vercel ready
- MongoDB Atlas compatible

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxx

# Email Service (Gmail - alternative)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Application
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173/admin
```

---

## Next Steps

1. **Add Frontend Features**
   - Create admin dashboard to view messages
   - Add user profile page
   - Implement message notifications

2. **Add Backend Features**
   - Rate limiting on contact form
   - Email verification
   - File upload support
   - Message search/filtering

3. **Deployment**
   - Follow DEPLOYMENT.md guide
   - Set up custom domain
   - Configure monitoring

4. **Security**
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Add rate limiting
   - Regular backups

---

## Troubleshooting

**MongoDB not connecting?**

```bash
# Start Docker MongoDB
docker run -d -p 27017:27017 mongo
# Or local: mongod
```

**Email not working?**

- Check API key or password
- Verify email address
- Check spam folder

**CORS errors?**

- Update FRONTEND_URL in backend/.env
- Restart backend server

**Port already in use?**

```bash
# Find process on port 5000
lsof -ti:5000 | xargs kill -9
```

---

## Documentation

- **README.md** - Complete guide with all features
- **QUICKSTART.md** - 5-minute setup
- **DEPLOYMENT.md** - Production deployment steps

Read these files for more details!

---

## Git Commands to Push to GitHub

```bash
# Initialize git (first time only)
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Full-stack portfolio with backend"

# Create GitHub repo online first, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main

# Future pushes
git add .
git commit -m "Your message"
git push
```

---

## Support & Resources

- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Mongoose Docs**: https://mongoosejs.com
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Your portfolio is now production-ready! 🚀**

For questions, check the documentation files or refer to the troubleshooting section in README.md.
