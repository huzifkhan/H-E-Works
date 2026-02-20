# 🚀 Production Deployment Guide

**Deploy your full-stack MERN application to Vercel (frontend) + Render (backend)**

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ [Neon PostgreSQL](https://neon.tech) account (free tier)
- ✅ [Render](https://render.com) account (free tier)
- ✅ [Vercel](https://vercel.com) account (free tier)
- ✅ Code pushed to GitHub: https://github.com/huzifkhan/H-E-Works

---

## 🎯 Deployment Steps

### **Phase 1: Deploy Backend to Render** (15 minutes)

#### **Step 1: Create Render Account**
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended) or email

#### **Step 2: Create New Web Service**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Find and select: **`huzifkhan/H-E-Works`**
4. Configure service:

**Basic Settings:**
- **Name:** `h-e-works-backend`
- **Region:** Oregon (closest to you)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Instance Type:**
- Select **"Free"** tier

#### **Step 3: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"** for each:

```
NODE_ENV = production
PORT = 10000
DATABASE_URL = [Your Neon PostgreSQL URL]
JWT_SECRET = [Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRE = 7d
CLIENT_URL = https://h-e-works.vercel.app (update after Vercel deploy)
SMTP_HOST = smtp.gmail.com (optional)
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com (optional)
SMTP_PASS = your-app-password (optional)
EMAIL_FROM_NAME = H&E Works
MAX_FILE_SIZE = 5242880
```

#### **Step 4: Add Disk for File Uploads**

Scroll to **"Disks"** → **"Add Disk"**:
- **Name:** `uploads`
- **Mount Path:** `/opt/render/project/src/uploads`
- **Size:** `1 GB` (free tier limit)

#### **Step 5: Deploy**
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your Render URL: `https://h-e-works-backend.onrender.com`

#### **Step 6: Test Backend**
Open in browser:
- `https://h-e-works-backend.onrender.com/api/health`
- Should show: `{"status":"OK","message":"Server is running"}`

---

### **Phase 2: Deploy Frontend to Vercel** (10 minutes)

#### **Step 1: Create Vercel Account**
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

#### **Step 2: Import Project**
1. Click **"Add New..."** → **"Project"**
2. Find and import: **`huzifkhan/H-E-Works`**
3. Configure project:

**Framework Preset:**
- Vite (auto-detected)

**Root Directory:**
- Click **"Edit"** → Select: `client`

**Build and Output Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### **Step 3: Add Environment Variables**

Click **"Environment Variables"** → **"Add Variable"**:

```
VITE_API_URL = https://h-e-works-backend.onrender.com/api
VITE_SITE_URL = https://h-e-works.vercel.app
```

#### **Step 4: Deploy**
1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Copy your Vercel URL: `https://h-e-works.vercel.app`

#### **Step 5: Test Frontend**
Open in browser:
- `https://h-e-works.vercel.app`
- Should see your homepage!

---

### **Phase 3: Connect Frontend + Backend** (5 minutes)

#### **Update Backend on Render**

1. Go back to Render dashboard
2. Select your backend service
3. Click **"Environment"** tab
4. Update `CLIENT_URL`:
   ```
   CLIENT_URL = https://h-e-works.vercel.app
   ```
5. Click **"Save Changes"**
6. Click **"Manual Deploy"** to restart

#### **Update Frontend on Vercel** (if needed)

If you need to update Vercel environment variables:
1. Go to Vercel dashboard
2. Select your project
3. Click **"Settings"** → **"Environment Variables"**
4. Edit variables as needed
5. Click **"Redeploy"**

---

## ✅ Test Your Live Application

### **1. Test Homepage**
- URL: `https://h-e-works.vercel.app`
- Should load with all content

### **2. Test Admin Login**
- URL: `https://h-e-works.vercel.app/admin/login`
- Email: `admin@business.com`
- Password: `admin123`

### **3. Test Contact Form**
- Go to: `https://h-e-works.vercel.app/contact`
- Submit a test message
- Check Render logs for submission

### **4. Test Admin Dashboard**
- View submissions
- Check analytics
- Manage services/projects

### **5. Test Password Reset**
- Click "Forgot Password"
- Enter admin email
- Check console for reset token (if SMTP not configured)

---

## 🔧 Troubleshooting

### **Frontend Shows "Network Error"**
**Fix:** Check VITE_API_URL in Vercel settings
- Must be: `https://your-app.onrender.com/api`
- Redeploy after changing

### **Backend Shows "Database Error"**
**Fix:** Check DATABASE_URL in Render settings
- Ensure Neon database is active
- Check connection string format

### **CORS Errors**
**Fix:** Update CLIENT_URL on Render
- Must match your Vercel URL exactly
- Include https://
- Redeploy backend

### **File Upload Not Working**
**Fix:** Check disk is mounted on Render
- Mount path: `/opt/render/project/src/uploads`
- Size: at least 1GB

### **Emails Not Sending**
**Fix:** Configure SMTP variables
- Or check console for reset tokens (dev mode)

---

## 📊 Monitoring

### **Render Logs**
- Go to Render dashboard
- Select backend service
- Click **"Logs"** tab
- View real-time logs

### **Vercel Analytics**
- Go to Vercel dashboard
- Select project
- Click **"Analytics"** tab
- View page views, performance

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] DATABASE_URL is private (not in GitHub)
- [ ] SMTP credentials are secure
- [ ] CORS is configured correctly
- [ ] Admin password is changed from default
- [ ] Environment variables are set in Render/Vercel (not in code)

---

## 💰 Cost Breakdown

### **Free Tier Includes:**

**Render:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ 512MB RAM
- ✅ 1GB disk storage
- ✅ Automatic HTTPS

**Vercel:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Edge network

**Neon PostgreSQL:**
- ✅ 0.5 GB storage
- ✅ Unlimited databases
- ✅ Automatic backups

**Total Cost: $0/month** 🎉

---

## 🎯 Custom Domain (Optional)

### **Vercel Custom Domain:**
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your domain
4. Update DNS records as instructed

### **Render Custom Domain:**
1. Go to Render service settings
2. Click **"Custom Domains"**
3. Add your domain
4. Update DNS records

---

## 📝 Maintenance

### **Update Your Code:**
```bash
# Make changes locally
git add .
git commit -m "feat: your changes"
git push
```

Both Render and Vercel will **auto-deploy** on push to `main` branch!

### **Check Logs:**
- **Render:** Dashboard → Service → Logs
- **Vercel:** Dashboard → Project → Deployments

### **Update Environment Variables:**
- **Render:** Dashboard → Service → Environment
- **Vercel:** Dashboard → Project → Settings → Environment Variables

---

## 🎉 You're Live!

**Your production URLs:**
- **Frontend:** `https://h-e-works.vercel.app`
- **Backend API:** `https://h-e-works-backend.onrender.com`
- **GitHub:** `https://github.com/huzifkhan/H-E-Works`

**Share your live website with the world!** 🚀

---

## 📞 Support

**Render Support:**
- Docs: https://render.com/docs
- Status: https://status.render.com

**Vercel Support:**
- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com

**Neon Support:**
- Docs: https://neon.tech/docs
- Discord: https://discord.gg/neon

---

**Deployment Date:** $(date +%Y-%m-%d)  
**Status:** Ready for Production  
**Estimated Setup Time:** 30 minutes
