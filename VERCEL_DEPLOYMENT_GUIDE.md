# Vercel Backend Deployment Guide

## Overview
This guide walks you through deploying your backend to Vercel for **free** without a credit card.

---

## ✅ Prerequisites

1. **GitHub Account** - Create at https://github.com
2. **Vercel Account** - Create at https://vercel.com (sign in with GitHub)
3. **Neon Database** - You already have this set up
4. **Git installed** on your local machine

---

## 📋 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
cd /home/huzaifa/Desktop/Brand
git init
git add .
git commit -m "Initial commit: Full stack brand website"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/brand-backend.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select your GitHub repository (`brand-backend`)
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave blank
   - **Build Command**: `npm --prefix backend install`
   - **Output Directory**: Leave blank
   - **Install Command**: `npm --prefix backend install`

5. Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `JWT_SECRET` | A random secure string (e.g., `openssl rand -hex 32`) |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your frontend URL (e.g., `https://your-site.vercel.app`) |
| `EMAIL_HOST` | Your SMTP host (e.g., `smtp.gmail.com`) |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASS` | Your email app password |
| `EMAIL_FROM` | `noreply@yourdomain.com` |

6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd /home/huzaifa/Desktop/Brand

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? brand-backend
# - Directory? ./
# - Override settings? N

# Set environment variables in Vercel dashboard after deploy
```

---

### Step 3: Configure Environment Variables

After deployment, go to your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all required variables (see table above)
3. Click **"Redeploy"** to apply changes

---

### Step 4: Test Your API

Once deployed, Vercel will give you a URL like:
```
https://brand-backend-yourname.vercel.app
```

Test your endpoints:

```bash
# Test root endpoint
curl https://your-project.vercel.app/

# Test health check
curl https://your-project.vercel.app/api/health

# Test projects endpoint
curl https://your-project.vercel.app/api/projects
```

---

### Step 5: Update Frontend API URL

Update your frontend to use the new Vercel backend URL:

1. In your frontend code, update the API base URL
2. Or create a `.env` file in the client folder:

```env
VITE_API_URL=https://your-project.vercel.app/api
```

3. Rebuild and redeploy your frontend

---

## 📁 Files Created for Vercel

The following files were added to support Vercel deployment:

```
Brand/
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to exclude from deployment
└── backend/
    └── api/
        └── index.js         # Serverless entry point
```

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"
- Check your `DATABASE_URL` environment variable
- Ensure Neon allows connections from Vercel IPs
- Verify SSL is enabled in your connection string

### Issue: "Module not found"
- Ensure all dependencies are in `backend/package.json`
- Run `npm install` in the backend folder before deploying

### Issue: "CORS error"
- Add your Vercel URL to `CLIENT_URL` environment variable
- Check CORS configuration in `server.js`

### Issue: First request is slow
- This is normal for serverless (cold start)
- Subsequent requests will be faster
- Consider using Vercel Pro for always-on (paid)

---

## 📊 Vercel Free Tier Limits

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Function Executions | 100 GB-hours |
| Build Minutes | 6,000 minutes/month |
| Projects | Unlimited |
| Domains | Unlimited |

---

## 🚀 Additional Tips

1. **Automatic Deployments**: Every push to `main` branch triggers auto-deploy
2. **Preview Deployments**: Pull requests create preview URLs
3. **Rollback**: Easily rollback to previous deployments from dashboard
4. **Analytics**: Free built-in analytics in dashboard
5. **Custom Domain**: Add free custom domain in Settings → Domains

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Neon Docs: https://neon.tech/docs

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Frontend updated with new API URL
- [ ] Database tables initialized

---

**Deployment Complete!** 🎉

Your backend is now running on Vercel's serverless infrastructure.
