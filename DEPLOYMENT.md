# Deployment Guide

This guide covers deploying the MERN Stack Business Website to various platforms.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

- [ ] Update all hardcoded values (company name, contact info, etc.)
- [ ] Change default admin credentials
- [ ] Test all features locally
- [ ] Build frontend without errors
- [ ] Set up MongoDB database
- [ ] Prepare environment variables
- [ ] Update CORS origins for production

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a region close to your users
   - Click "Create"

3. **Configure Access**
   - **Database Access:** Create a database user with username and password
   - **Network Access:** Add IP address (0.0.0.0/0 for all IPs)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Backend .env**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/business-website?retryWrites=true&w=majority
   ```

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB locally
# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/business-website
```

---

## Backend Deployment

### Option 1: Railway

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app/)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables (see below)
   - Click "Deploy"

3. **Get your Railway URL**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Web Service**
   - Go to [Render](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** your-app-name
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

2. **Add Environment Variables**
   - Copy all variables from `.env.example`
   - Update with production values

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and Deploy**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set CLIENT_URL="https://your-frontend-url.com"
   git push heroku main
   ```

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. **Set up server**
   ```bash
   # SSH into server
   ssh user@your-server-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   # (follow MongoDB installation guide for your OS)
   ```

2. **Deploy application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd Brand/backend
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   npm install -g pm2
   pm2 start server.js --name business-api
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel login
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your project in Vercel dashboard
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com/api`

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository

2. **Build Settings**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

3. **Environment Variables**
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**
   - Click "Deploy site"

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd client
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: VPS with Nginx

1. **Build frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to server**
   ```bash
   scp -r dist/* user@your-server-ip:/var/www/business-website/
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/business-website;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable and restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/business-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Environment Variables

### Backend Production Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/business-website
JWT_SECRET=use-a-long-random-string-here-min-32-chars
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Production Variables

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Generate Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

## Post-Deployment

### 1. Seed Admin User

```bash
# Connect to your deployed backend
# Run the seed script
ssh user@your-server-ip
cd Brand/backend
npm run seed
```

Or use the registration endpoint if exposed.

### 2. Test All Features

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Dashboard displays data
- [ ] Can update submission status
- [ ] Can delete submissions
- [ ] Mobile responsive design works

### 3. Set Up SSL/HTTPS

**Using Let's Encrypt (Free):**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

### 4. Monitor Your Application

**Backend:**
- Use PM2 for process management
- Set up logging with a service like Papertrail
- Monitor with UptimeRobot or Pingdom

**Frontend:**
- Use Vercel/Netlify analytics
- Set up Google Analytics
- Monitor with Sentry for errors

### 5. Backup Strategy

**MongoDB:**
```bash
# Create backup script
#!/bin/bash
mongodump --uri="your-mongodb-uri" --out=/backups/$(date +%Y%m%d)

# Schedule with cron
0 2 * * * /path/to/backup-script.sh
```

---

## Troubleshooting

### CORS Errors
```javascript
// Update backend server.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

### Database Connection Failed
- Check MongoDB is running
- Verify connection string
- Ensure IP is whitelisted (Atlas)
- Check network/firewall rules

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Implement caching (Redis)
- Use CDN for static assets
- Optimize database queries with indexes

### Frontend
- Enable code splitting
- Lazy load components
- Optimize images
- Use service workers (PWA)

---

## Security Best Practices

1. **Always use HTTPS**
2. **Keep dependencies updated**
3. **Use environment variables for secrets**
4. **Implement rate limiting**
5. **Set up CORS properly**
6. **Use strong passwords**
7. **Enable 2FA for admin accounts**
8. **Regular security audits**

---

## Support

For deployment issues:
- Check platform documentation
- Review error logs
- Contact platform support
- Create a GitHub issue

---

Good luck with your deployment! 🚀
