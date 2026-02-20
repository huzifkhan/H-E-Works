# Quick Start Guide - H&E Works Website

## 🚀 Complete Setup in 5 Minutes

### Prerequisites
- Node.js v18+ installed
- Neon PostgreSQL account (free tier available)
- npm or yarn package manager

---

## Step 1: Clone & Install

```bash
# Clone repository (or navigate to project folder)
cd Brand

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## Step 2: Configure Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:password@ep-xxx...`)
4. Edit `backend/.env` and paste it as `DATABASE_URL`

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

## Step 3: Run Database Migrations

```bash
cd backend

# Run ALL migrations (recommended for new setup)
npm run migrate:all

# Seed admin user
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@business.com`
- Password: `admin123`

⚠️ **Change these in production!**

---

## Step 4: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

---

## ✅ Verify Installation

### Test Public Pages
- http://localhost:5173/ - Homepage
- http://localhost:5173/services - Services page
- http://localhost:5173/projects - Projects gallery
- http://localhost:5173/contact - Contact form

### Test Admin Dashboard
1. Login: http://localhost:5173/admin/login
2. Use credentials: `admin@business.com` / `admin123`
3. Access:
   - Dashboard: View submissions
   - Analytics: View charts and metrics
   - Services: Manage services
   - Projects: Manage projects with images
   - Testimonials: Manage testimonials

### Run Automated Tests
```bash
cd backend
npm run test:apis
```

All tests should show ✅ Success.

---

## 📁 Project Structure

```
Brand/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   ├── initDB.js          # Base table creation
│   │   ├── phase3-migrate.js  # Phase 3 tables
│   │   ├── admin-migrate.js   # Admin table updates
│   │   ├── add-replied-at.js  # Add replied_at column
│   │   └── migrate-all.js     # Run all migrations
│   ├── controllers/           # API logic
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── middleware/            # Auth, upload, etc.
│   ├── utils/                 # Helper functions
│   ├── .env                   # Environment variables
│   └── server.js              # Express server
├── client/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context
│   │   ├── utils/             # API client, helpers
│   │   └── App.jsx            # Main app
│   └── package.json
├── history/                   # Prompt history records
└── README.md
```

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev              # Start development server
npm run start            # Start production server
npm run seed             # Seed admin user
npm run migrate:all      # Run all migrations
npm run migrate:phase3   # Phase 3 tables only
npm run test:apis        # Run API tests
```

### Frontend
```bash
npm run dev              # Development server (Vite)
npm run build            # Production build
npm run preview          # Preview production build
```

---

## 🎯 Features Overview

### Phase 1: Contact Form ✅
- File attachments (up to 5 files, 5MB each)
- Email notifications (admin + customer auto-reply)
- reCAPTCHA spam protection
- Database storage with Neon PostgreSQL

### Phase 2: Admin Dashboard ✅
- Submission management (view, filter, search)
- CSV export functionality
- Bulk actions (update status, delete)
- Status tracking (new, read, replied, archived)

### Phase 3: Services/Portfolio/Testimonials ✅
- **Services Management**: CRUD operations, categories, icons
- **Projects Portfolio**: CRUD with image upload, featured projects
- **Testimonials**: CRUD with ratings, approval system
- **Public Pages**: Dynamic services, projects, testimonials display

### Phase 4: Analytics & Reporting ✅
- Dashboard statistics (submissions, projects, services, testimonials)
- Growth metrics (30-day comparison)
- Conversion tracking
- Response time analytics
- Interactive charts (line, pie, bar)
- CSV export

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Check your `DATABASE_URL` in `backend/.env` is correct.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change `PORT` in `backend/.env` or kill the process using port 5000.

### Login Fails
```
column "last_login" does not exist
```
**Solution:** Run `npm run migrate:admin` in backend folder.

### Analytics Error
```
column "replied_at" does not exist
```
**Solution:** Run `npm run migrate:add-replied-at` in backend folder.

### Frontend Won't Start
```
Error: Cannot find module
```
**Solution:** Run `npm install` in client folder.

---

## 📊 Database Schema

### Tables Created
1. **admins** - Admin users with authentication
2. **contact_submissions** - Contact form submissions
3. **services** - Services offered
4. **projects** - Project portfolio
5. **project_images** - Project image gallery
6. **testimonials** - Client testimonials

### Run All Migrations
```bash
cd backend
npm run migrate:all
```

This creates all tables with proper indexes and sample data.

---

## 🔐 Security Best Practices

1. **Change Default Password** immediately after first login
2. **Use Strong JWT Secret** - generate a random 32+ character string
3. **Enable HTTPS** in production
4. **Set CLIENT_URL** to your actual domain
5. **Use Environment Variables** for all secrets
6. **Enable Rate Limiting** (already configured)
7. **Regular Backups** of your Neon database

---

## 📈 Performance Tips

1. **Database Indexes**: Already created for common queries
2. **Connection Pooling**: Configured in `db.js` (max 20 connections)
3. **Image Optimization**: Compress images before upload
4. **Frontend Build**: Always use `npm run build` for production
5. **CDN**: Consider using CDN for static assets

---

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Set all environment variables
2. Connect to Neon PostgreSQL
3. Run `npm run migrate:all`
4. Deploy

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy `dist` folder

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
SMTP_USER=your-email@gmail.com (optional)
SMTP_PASS=your-app-password (optional)
RECAPTCHA_SITE_KEY=your-site-key (optional)
RECAPTCHA_SECRET_KEY=your-secret-key (optional)
```

### Frontend (.env - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### API Tests
```bash
cd backend
npm run test:apis
```

### Manual Testing Checklist
- [ ] Submit contact form
- [ ] Login to admin
- [ ] View analytics dashboard
- [ ] Add/edit/delete service
- [ ] Add/edit/delete project
- [ ] Upload project images
- [ ] Add/edit/delete testimonial
- [ ] Export CSV
- [ ] Filter submissions

---

## 📞 Support

### Documentation
- `README.md` - Main documentation
- `PHASE3_IMPLEMENTATION.md` - Phase 3 details
- `PHASE4_IMPLEMENTATION.md` - Phase 4 details
- `TEST_REPORT_COMPREHENSIVE.md` - Test results

### Logs
- Backend: `/tmp/backend.log`
- Frontend: `/tmp/frontend.log`

### Quick Commands
```bash
# Check backend status
curl http://localhost:5000/api/health

# Check frontend status
curl http://localhost:5173

# Run all tests
cd backend && npm run test:apis
```

---

## ✅ Success Indicators

You know everything is working when:
- ✅ Backend starts without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Can login to admin dashboard
- ✅ Analytics page shows charts
- ✅ All API tests pass

---

**Last Updated:** February 19, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
