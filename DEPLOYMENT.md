# Deployment Guide

Complete guide to deploy your portfolio application to production.

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Email Configuration](#email-configuration)
6. [Post-Deployment](#post-deployment)

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
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

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

## Backend Deployment (Render)

### Step 1: Prepare Backend

Ensure `backend/package.json` has proper start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Sign up"
3. Connect with GitHub
4. Authorize Render to access your repositories

### Step 3: Deploy Backend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your portfolio repository
3. Configure deployment:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to you
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Click **"Create Web Service"**

### Step 4: Set Environment Variables

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
4. **Build Command**: `npm run build` (should auto-detect)
5. **Output Directory**: `dist` (should auto-detect)
6. Click **"Configure"**

### Step 4: Set Environment Variables

Add in **Environment Variables**:

```
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com
```

Replace `portfolio-backend-xxxx.onrender.com` with your actual Render backend URL.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. You'll get a URL like: `https://portfolio-xxxxx.vercel.app`

### Step 6: Update Backend URL (if needed)

If you need to update the backend URL later:

1. Go to Vercel project settings
2. **Environment Variables**
3. Update `VITE_API_URL`
4. Redeploy: Click **"Deployments"** → **"Redeploy"** on latest build

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Start free"**
3. Create account with email
4. Verify email

### Step 2: Create Cluster

1. Click **"Create a Deployment"**
2. Choose **"Free"** tier
3. Select cloud provider (AWS recommended)
4. Select region closest to you
5. Click **"Create Deployment"**
6. Wait for cluster to be created (~5-10 minutes)

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

Both Render and Vercel auto-deploy on GitHub push.

Verify in:

- **Render**: Web Service → **"Deploy"** → "GitHub"
- **Vercel**: Project Settings → **"Git"** → "Deployments"

### 6. Backup & Monitoring

**Database Backups**:

- MongoDB Atlas handles automatic backups
- Configure in: **Cluster** → **"Backup"**

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
4. View logs: Click service → "Logs"

### Frontend shows 404 errors

1. Verify `VITE_API_URL` is set correctly
2. Check if backend is running
3. Rebuild frontend: Vercel → "Deployments" → "Redeploy"

### Contact form not sending emails

1. Verify email credentials in environment variables
2. Check backend logs for email errors
3. Test API directly with curl
4. Check spam folder for emails

### MongoDB connection failing

1. Verify connection string in environment
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user password is correct
4. Test connection with MongoDB Compass

### CORS errors

Update backend `server.js`:

```javascript
app.use(
  cors({
    origin: "https://your-vercel-url.vercel.app",
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
