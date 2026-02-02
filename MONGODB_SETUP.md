# MongoDB Atlas Setup Guide

Quick guide to set up MongoDB for your portfolio deployment.

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"**
3. Choose **"Create an account"** or sign in with Google
4. Verify your email

---

## Step 2: Create a Free Cluster

1. Click **"Create a Deployment"**
2. Choose **"Free"** tier
3. Select **Cloud Provider**: AWS (recommended)
4. Select **Region**: Choose closest to you (or use default)
5. Click **"Create Deployment"**
6. Wait 5-10 minutes for cluster to be created

---

## Step 3: Create Database User

1. In MongoDB dashboard, go to **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. **Username**: Enter a username (e.g., `portfolio_user`)
5. **Password**: Click **"Generate Secure Password"** and save it somewhere safe!
6. **User Privileges**: Select **"Atlas Admin"**
7. Click **"Add User"**

**⚠️ Save your username and password - you'll need them!**

---

## Step 4: Configure Network Access

1. Go to **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"**
4. Click **"Confirm"**

_For production, you can restrict to Render's IP later_

---

## Step 5: Get Your Connection String

1. Go to **"Databases"** (left menu)
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Select **"Node.js"** and version **4.0 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Important**: Replace `<username>` and `<password>` with your actual credentials!

---

## Step 6: Add to Render Environment

1. Go to your **`portfolio`** service on Render
2. Click **"Environment"**
3. Click **"Add Environment Variable"**
4. **Key**: `MONGODB_URI`
5. **Value**: Paste your connection string
6. Click **"Save"**
7. Service will auto-redeploy

---

## Step 7: Verify Connection

```bash
curl https://portfolio-e302.onrender.com/api/health
```

Should return:

```json
{ "status": "ok", "database": "connected", "timestamp": "2026-01-24T..." }
```

---

## Common Issues

### IP Whitelist Error

- ✅ Make sure you chose "Allow Access from Anywhere" in Network Access
- Or add Render's IP range manually

### Authentication Failed

- ✅ Check username and password are correct in connection string
- ✅ Make sure no special characters are escaped in the URL
- ✅ Try generating a new password

### Connection Timeout

- ✅ Wait 5 minutes after creating user/network rules
- ✅ Check if cluster is fully created (status should be "RUNNING")

---

**Once connected, you're ready to set up email configuration!**

Next: Add email environment variables to Render
