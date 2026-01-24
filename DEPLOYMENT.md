# Deployment Guide (Render)

Complete guide to deploy your portfolio application to production using Render for both backend and frontend.

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Render Setup](#render-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
6. [Email Configuration](#email-configuration)
7. [Post-Deployment](#post-deployment)

---

## GitHub Setup

### 1. Create GitHub Repository

```bash
# In your project directory
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack portfolio application"

# Add remote repository
git remote add origin https://github.com/odionmurphy/portfolio.git

# Create main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### 2. Git Push Verification

```bash
# Verify remote
git remote -v

# Check status
git status
```

---

## Render Setup

### Manual Backend Setup (if not using render.yaml)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your portfolio repository
3. Configure deployment:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to you
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Click **"Create Web Service"**

### Backend Environment Variables

In Render dashboard, go to your service → **Environment**, add:

| Variable         | Value                                 |
| ---------------- | ------------------------------------- |
| `MONGODB_URI`    | Your MongoDB connection string        |
| `JWT_SECRET`     | A strong random string (change this!) |
| `RESEND_API_KEY` | Your Resend API key (optional)        |
| `EMAIL_SERVICE`  | `gmail` (or leave empty)              |
| `EMAIL_USER`     | Your email address                    |
| `EMAIL_PASSWORD` | Your Gmail app password               |
| `FRONTEND_URL`   | Your Render frontend URL              |
| `ADMIN_URL`      | Your Render frontend URL + `/admin`   |
| `NODE_ENV`       | `production`                          |
| `PORT`           | `10000`                               |

### Backend Deployment

- Render automatically deploys when you push to GitHub
- Monitor deployment in Render dashboard
- Once complete, you'll have a URL like: `https://portfolio-backend-xxxx.onrender.com`

**Save your backend URL for the frontend setup**
In Render dashboard, go to your service → **Environment**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=gmail
JWT_SECRET=your-very-secure-random-string-here
FRONTEND_URL=https://your-vercel-url.vercel.app
ADMIN_URL=https://your-vercel-url.vercel.app/admin
NODE_ENV=production
PORT=10000
```

### Step 5: Deploy

- Render automatically deploys when you push to GitHub
- Monitor deployment in Render dashboard
- Once complete, you'll have a URL like: `https://portfolio-backend-xxxx.onrender.com`

**Note**: Save your backend URL, you'll need it for frontend configuration.

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project

1. Click **"New Project"**
2. Import your GitHub repository
3. Select the portfolio repository

### Step 3: Configure Project

1. **Project Name**: `portfolio`
2. **Framework Preset**: `Vite`
3. **Root Directory**: `./` (default)
4. **Build Command**: `nRender Static Site)

### Automatic Deployment with render.yaml

When using `render.yaml`, the frontend deploys as a **Static Site** on Render:

1. The `render.yaml` automatically configures this
2. Render will run: `npm install && npm run build`
3. Serves static files from `dist/` folder
4. Much faster and cost-effective than a web service

### Manual Frontend Setup (if not using render.yaml)

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select your portfolio repository
3. Configure:
   - **Name**: `portfolio-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click **"Create Static Site"**

### Frontend Environment Variables

In Render dashboard, go to your site → **Environment**, add:

| Variable       | Value                   |
| -------------- | ----------------------- |
| `VITE_API_URL` | Your Render backend URL |

Example:

```
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com
```

### Frontend Deployment

- Render automatically deploys when you push to GitHub
- Automatic SPA routing is configured in `render.yaml`
- You'll get a URL like: `https://portfolio-frontend-xxxx.onrender.com`

### Update Backend URL (if needed)

If you need to update the backend URL later:

1. Go to Render site settings
2. **Environment** → Edit `VITE_API_URL`
3. **Redeploy** (automatic on next push or manual trigger)

### Step 3: Create Database User

1. In cluster dashboard, go to **"Database Access"**
2. Click **"Add New Database User"**
3. **Username**: Choose a strong username
4. **Password**: Generate secure password
5. **User Privileges**: Select **"Atlas Admin"**
6. Click **"Add User"**

**Save these credentials, you'll need them!**

### Step 4: Get Connection String

1. Go to your cluster → **"Connect"**
2. Click **"Drivers"**
3. Select **"Node.js"**
4. Copy connection string, looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password

### Step 5: Create Database & Collections

The app will auto-create these on first use:

- `users` - Store user accounts
- `contacts` - Store contact form submissions

### Step 6: Network Access

1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (or add Render's IP)
4. Click **"Confirm"**

**⚠️ Note**: "Allow Access from Anywhere" is convenient but less secure. In production, consider restricting to specific IPs.

---

## Email Configuration

### Option 1: Using Resend (Recommended)

**Advantages**: Simple, reliable, good free tier

1. Go to [https://resend.com](https://resend.com)
2. Sign up with email
3. Go to **"API Keys"**
4. Click **"Create API Key"**
5. Copy the key
6. Add to environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
   ```

### Option 2: Using Gmail (SMTP)

**Advantages**: Free, familiar

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Enable **"2-Step Verification"**
3. Go to **"App Passwords"**
4. Generate password for "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Add to environment variables:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

### Option 3: Using SendGrid

1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Create account and verify email
3. Create API key
4. Use with Resend or custom implementation

---

## Post-Deployment

### 1. Verify Application

1. Visit your frontend URL: `https://portfolio-xxxxx.vercel.app`
2. Check if styles load correctly
3. Navigate to Contact section
4. Submit test contact form
5. Check email for confirmation

### 2. Test Backend API

```bash
# Health check
curl https://portfolio-backend-xxxx.onrender.com/api/health

# Test contact form
curl -X POST https://portfolio-backend-xxxx.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### 3. Monitor Logs

**Render Backend Logs**:

1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor for errors

**Vercel Frontend Logs**:

1. Go to Vercel project
2. Click **"Deployments"**
3. Click on latest deployment
4. Check build logs

### 4. Configure Custom Domain (Optional)

**For Vercel (Frontend)**:

1. Project Settings → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions

**For Render (Backend)**:

1. Your Web Service → **"Settings"**
2. Under "Custom Domain", add domain
3. Follow DNS configuration instructions

### 5. Set Up Auto-Deployment

Render automatically deploys on GitHub push.

Verify in:

- **Render Backend**: Web Service → **"Settings"** → "GitHub"
- **Render Frontend**: Static Site → **"Settings"** → "GitHub"
  Render Frontend\*\*:

1. Your Static Site → **"Settings"**
2. Under "Custom Domain", add domain
3. Follow DNS configuration instructions

**For Render Backendter** → **"Backup"**

**Monitoring**:

- Set up error alerts in both platforms
- Monitor database usage
- Check email logs

### 7. Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Use HTTPS everywhere (automatic on Vercel/Render)
- [ ] Restrict MongoDB network access to Render IP
- [ ] Use environment variables (no secrets in code)
- [ ] Enable 2FA on GitHub, Vercel, Render, MongoDB
- [ ] Review CORS settings in backend
- [ ] Test contact form for spam

---

## Troubleshooting Deployment

### Backend won't start on Render

1. Check build log in Render dashboard
2. Verify `backend/package.json` exists
3. Check start command: `cd backend && npm start`
4. View logs: Web Service → "Logs"

### Frontend shows 404 errors

1. Verify `VITE_API_URL` is set correctly in environment
2. Check if backend is running
3. Rebuild frontend: Static Site → "Deploys" → Trigger deploy
4. Check build logs for errors

### Frontend routing returns 404

1. `render.yaml` already handles SPA routing
2. All routes should rewrite to `index.html`
3. If issues persist, check Render static site settings

### Contact form not sending emails

1. Verify email credentials in backend environment variables
2. Check backend logs for email errors: Web Service → "Logs"
3. Test API directly with curl
4. Check spam folder for emails

### MongoDB connection failing

1. Verify connection string in environment
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user password is correct
4. Test connection with MongoDB Compass

### CORS errors

Update backend `server.js` if needed:

```javascript
app.use(
  cors({
    origin: "https://your-render-frontend.onrender.com",
    credentials: true,
  }),
);
```

---

## Production Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Email service configured (Resend or Gmail)
- [ ] All environment variables set
- [ ] Contact form tested
- [ ] Email delivery verified
- [ ] Custom domains configured (optional)
- [ ] Security settings reviewed
- [ ] Monitoring and logs configured

---

## Need Help?

- Check application logs on Render and Vercel
- Review MongoDB documentation: [docs.mongodb.com](https://docs.mongodb.com)
- Render support: [render.com/docs](https://render.com/docs)
- Vercel support: [vercel.com/docs](https://vercel.com/docs)

---

**Happy deploying! 🚀**
