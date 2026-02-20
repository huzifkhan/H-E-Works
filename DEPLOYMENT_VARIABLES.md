# Production Environment Variables Guide

## Backend (Render)

### Required Variables:
```env
NODE_ENV=production
PORT=10000

# Database (Get from Neon dashboard)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# JWT (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRE=7d

# Frontend URL (Get from Vercel after deployment)
CLIENT_URL=https://your-app.vercel.app

# Email (Optional - for password reset & notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=H&E Works
ADMIN_EMAIL=admin@business.com

# File Upload
MAX_FILE_SIZE=5242880
```

## Frontend (Vercel)

### Required Variables:
```env
VITE_API_URL=https://your-app.onrender.com/api
VITE_SITE_URL=https://your-app.vercel.app
```

---

## How to Get Values:

### DATABASE_URL (Neon PostgreSQL)
1. Go to https://neon.tech
2. Select your project
3. Copy connection string
4. Replace `<password>` with actual password

### SMTP Credentials (Gmail)
1. Enable 2FA on Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password
4. Use email as SMTP_USER and password as SMTP_PASS

### JWT_SECRET
Generate a random 32+ character string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deployment Order:

1. **Deploy Backend to Render First**
   - Get Render URL (e.g., `https://h-e-works-backend.onrender.com`)
   
2. **Then Deploy Frontend to Vercel**
   - Set VITE_API_URL to Render backend URL
   - Get Vercel URL (e.g., `https://h-e-works.vercel.app`)
   
3. **Update Backend**
   - Set CLIENT_URL to Vercel frontend URL

---

## Testing:

After deployment:
1. Open Vercel frontend URL
2. Try logging in: admin@business.com / admin123
3. Test contact form
4. Test password reset
5. Check admin dashboard
