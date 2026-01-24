# Render Deployment Checklist

## Pre-Deployment Setup

### 1. GitHub Repository

- [ ] Repository created on GitHub
- [ ] All code committed: `git add . && git commit -m "Ready for Render deployment"`
- [ ] Pushed to main branch: `git push origin main`
- [ ] Render has authorization to access repository

### 2. Database Setup

- [ ] MongoDB Atlas account created
- [ ] Cluster created (Free tier OK)
- [ ] Database user created with strong password
- [ ] Connection string copied
- [ ] IP whitelist configured (Allow "Anywhere" for now, or add Render IPs)

### 3. Email Configuration

- [ ] **Option A - Resend**: Account created, API key generated
- [ ] **Option B - Gmail**: 2FA enabled, app password generated
- [ ] Test email sending locally

### 4. Environment Setup

- [ ] `render.yaml` exists in root directory
- [ ] `.env.production` exists with `VITE_API_URL`
- [ ] `backend/package.json` has correct `start` script
- [ ] Frontend `package.json` has `build` script

---

## Deployment Steps

### Step 1: Deploy Services on Render

- [ ] Go to [render.com](https://render.com) and sign in with GitHub
- [ ] Create Blueprint or manually create services:
  - [ ] Backend Web Service created (portfolio-backend)
  - [ ] Frontend Static Site created (portfolio-frontend)
- [ ] Note backend URL: `https://portfolio-backend-xxxx.onrender.com`
- [ ] Note frontend URL: `https://portfolio-frontend-xxxx.onrender.com`

### Step 2: Configure Environment Variables

**Backend Service (portfolio-backend)**

- [ ] `MONGODB_URI` = MongoDB connection string
- [ ] `JWT_SECRET` = Random secure string (e.g., `$(openssl rand -base64 32)`)
- [ ] `EMAIL_SERVICE` = `gmail` or `resend`
- [ ] `EMAIL_USER` = Your email address (if Gmail)
- [ ] `EMAIL_PASSWORD` = Gmail app password (if Gmail)
- [ ] `RESEND_API_KEY` = Resend API key (if Resend)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `FRONTEND_URL` = Your frontend URL (e.g., `https://portfolio-frontend-xxxx.onrender.com`)
- [ ] `ADMIN_URL` = Frontend URL + `/admin`

**Frontend Static Site (portfolio-frontend)**

- [ ] `VITE_API_URL` = Your backend URL (e.g., `https://portfolio-backend-xxxx.onrender.com`)

### Step 3: Verify Deployment

- [ ] Backend service shows "Live" status
- [ ] Frontend site shows "Live" status
- [ ] Check build logs for any errors
- [ ] Both services deployed successfully

### Step 4: Test Application

**API Health Check**

```bash
curl https://portfolio-backend-xxxx.onrender.com/api/health
```

- [ ] Returns `{"status":"ok","database":"connected"}`

**Frontend Access**

- [ ] Visit frontend URL in browser
- [ ] Page loads with proper styling
- [ ] No console errors (F12)

**Contact Form Test**

- [ ] Fill out contact form
- [ ] Submit form
- [ ] Check for success message
- [ ] Receive email confirmation

---

## Post-Deployment Verification

### Frontend Checks

- [ ] [ ] All pages accessible (home, about, projects, contact, admin)
- [ ] [ ] Navigation works correctly
- [ ] [ ] Images and styling display properly
- [ ] [ ] Responsive design works on mobile
- [ ] [ ] No 404 errors in console

### Backend Checks

- [ ] [ ] Health endpoint responds correctly
- [ ] [ ] Contact form submissions saved to database
- [ ] [ ] Emails being sent successfully
- [ ] [ ] Admin login works
- [ ] [ ] No errors in backend logs

### Email Verification

- [ ] [ ] Contact form emails arrive
- [ ] [ ] Emails not in spam folder
- [ ] [ ] Email formatting is correct
- [ ] [ ] Reply email address is correct

---

## Troubleshooting Checklist

### If Frontend shows 404:

- [ ] Check `VITE_API_URL` environment variable
- [ ] Verify backend URL is correct and accessible
- [ ] Check browser console for error messages
- [ ] Rebuild frontend: Trigger redeploy in Render

### If Contact Form doesn't work:

- [ ] Verify backend is running (check logs)
- [ ] Check email credentials in environment variables
- [ ] Test API directly: `curl -X POST https://portfolio-backend-xxxx.onrender.com/api/contact ...`
- [ ] Check backend logs for email errors

### If Backend won't start:

- [ ] Check build logs in Render dashboard
- [ ] Verify `cd backend && npm start` command works locally
- [ ] Check all environment variables are set
- [ ] Verify `backend/package.json` exists and is valid

### If MongoDB connection fails:

- [ ] Verify connection string is correct
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Test connection with MongoDB Compass locally
- [ ] Ensure database user password doesn't contain special characters that need escaping

---

## Final Production Setup (Optional)

- [ ] Custom domain configured for frontend
- [ ] Custom domain configured for backend (API)
- [ ] DNS records updated
- [ ] HTTPS verified (automatic on Render)
- [ ] Monitoring/alerts configured
- [ ] Backup strategy for database

---

## After Deployment

- [ ] Share frontend URL with friends/family
- [ ] Update resume/portfolio with deployment URL
- [ ] Save credentials safely
- [ ] Monitor logs regularly
- [ ] Keep code backed up on GitHub

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

Last Updated: $(date)
