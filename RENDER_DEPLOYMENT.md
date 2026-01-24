# Render Deployment Setup Guide

This guide walks you through deploying both backend and frontend on Render.

## Quick Start

### Option 1: Automated Deployment (Recommended)

Use `render.yaml` for one-click deployment:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Setup for Render deployment"
   git push origin main
   ```

2. **Create Blueprint in Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click **"New"** → **"Blueprint"**
   - Select your portfolio repository
   - Render automatically detects `render.yaml`
   - Click **"Create"**

3. **Add Environment Variables**
   - After blueprint creation, go to **"Environment"**
   - Add required variables (see below)

### Option 2: Manual Setup

Deploy each service individually in Render dashboard.

---

## Required Environment Variables

### Backend Variables (Web Service)

Set in Render dashboard for `portfolio-backend` service:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your-random-secure-string-here
RESEND_API_KEY=re_xxxxx (optional, for Resend email)
EMAIL_SERVICE=gmail (or leave empty)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password (Gmail app password)
NODE_ENV=production
PORT=10000
```

### Frontend Variables (Static Site)

Set in Render dashboard for `portfolio-frontend` site:

```
VITE_API_URL=https://portfolio-backend-xxxx.onrender.com
```

Replace the URL with your actual Render backend URL.

---

## Setup Steps

### 1. MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and cluster
3. Create database user
4. Get connection string
5. Add `MONGODB_URI` to backend environment variables

[Detailed MongoDB Setup](../DEPLOYMENT.md#database-setup-mongodb-atlas)

### 2. Email Configuration

Choose one:

**Option A: Resend (Recommended)**

- Go to [resend.com](https://resend.com)
- Create API key
- Add `RESEND_API_KEY` to backend environment variables

**Option B: Gmail (SMTP)**

- Enable 2FA in Gmail
- Create app password
- Add `EMAIL_USER` and `EMAIL_PASSWORD` to backend environment variables

### 3. Deploy Services

**Using Blueprint (Automated)**:

- Follow Option 1 above
- Render creates both services automatically

**Manual Setup**:

1. Create web service for backend
2. Create static site for frontend
3. Link them via `VITE_API_URL` environment variable

### 4. Update Frontend URL in Backend

After frontend deploys, update backend environment:

- Go to `portfolio-backend` web service
- Add/update `FRONTEND_URL` with your Render frontend URL
- Redeploy (or wait for next Git push)

---

## After Deployment

### Test Everything

```bash
# Health check
curl https://portfolio-backend-xxxx.onrender.com/api/health

# Frontend
Open https://portfolio-frontend-xxxx.onrender.com in browser
```

### Verify Contact Form

1. Visit frontend URL
2. Go to Contact section
3. Submit test form
4. Verify email is received

### Monitor Logs

- **Backend**: Web Service → "Logs"
- **Frontend**: Static Site → "Deploys" → View build logs

---

## Environment Variables Reference

| Variable         | Service  | Required | Purpose                                |
| ---------------- | -------- | -------- | -------------------------------------- |
| `MONGODB_URI`    | Backend  | ✅       | MongoDB connection string              |
| `JWT_SECRET`     | Backend  | ✅       | JWT signing secret (use random string) |
| `NODE_ENV`       | Backend  | ✅       | Should be `production`                 |
| `PORT`           | Backend  | ✅       | Should be `10000`                      |
| `EMAIL_SERVICE`  | Backend  | ❌       | Email provider (gmail, resend)         |
| `EMAIL_USER`     | Backend  | ❌       | Email address if using Gmail           |
| `EMAIL_PASSWORD` | Backend  | ❌       | Gmail app password                     |
| `RESEND_API_KEY` | Backend  | ❌       | Resend API key if using Resend         |
| `FRONTEND_URL`   | Backend  | ⚠️       | Frontend URL (for CORS)                |
| `ADMIN_URL`      | Backend  | ⚠️       | Admin page URL (for emails)            |
| `VITE_API_URL`   | Frontend | ✅       | Backend API URL                        |

**✅ = Required for deployment**
**❌ = Optional**
**⚠️ = Set after frontend deploys**

---

## Troubleshooting

### Frontend Shows 404

**Cause**: SPA routing issue
**Solution**: Check that `render.yaml` has rewrite rules configured

### Contact Form Not Sending

**Cause**: Email configuration missing
**Solution**:

1. Verify email credentials in backend environment
2. Check backend logs: Web Service → "Logs"

### Backend Connection Refused

**Cause**: Service not deployed or crashed
**Solution**:

1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Look for errors in "Logs" tab

### MongoDB Connection Error

**Cause**: Wrong connection string or IP whitelist
**Solution**:

1. Verify MongoDB connection string
2. Check IP whitelist in MongoDB Atlas
3. Use IP: "Allow Access from Anywhere" or add Render's IP

---

## File Structure for Deployment

```
portfolio/
├── render.yaml                 ← Automated deployment config
├── .env.production             ← Frontend env for production
├── package.json                ← Frontend dependencies
├── vite.config.ts              ← Frontend build config
├── tsconfig.json               ← TypeScript config
├── src/                        ← React components
├── dist/                       ← Built frontend (generated)
└── backend/
    ├── package.json            ← Backend dependencies
    ├── server.js               ← Express server
    ├── .env                    ← Backend env (local only)
    ├── config/
    ├── routes/
    ├── models/
    └── middleware/
```

---

## Advanced Configuration

### Custom Domain

1. In Render service settings
2. Add custom domain
3. Follow DNS configuration
4. Update `VITE_API_URL` if backend domain changes

### Build Hooks

Render automatically deploys on GitHub push. To manually trigger:

1. Go to service/site
2. Click "Deploys" tab
3. Click "Deploy latest commit"

### Scaling

- **Static site**: No scaling needed (Render handles automatically)
- **Web service**: Upgrade plan for more resources if needed

---

## Production Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas cluster created and secured
- [ ] Email service configured (Resend or Gmail)
- [ ] `render.yaml` in root directory
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set correctly
- [ ] Contact form tested and email received
- [ ] Backend logs show no errors
- [ ] Frontend loads with correct styling
- [ ] API calls working from frontend
- [ ] Custom domain configured (optional)

---

## Need Help?

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Main Deployment Guide**: See [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Common Issues**: Check DEPLOYMENT.md troubleshooting section

---

Happy deploying! 🚀
