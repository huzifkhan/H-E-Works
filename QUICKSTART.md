# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB running locally or MongoDB Atlas account

## Installation (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables
Backend is already configured with `.env` file for local development.

### 4. Seed Admin User
```bash
cd ../backend
npm run seed
```

This creates:
- **Email:** admin@business.com
- **Password:** admin123

### 5. Start Backend Server
```bash
npm run dev
```
Backend runs on http://localhost:5000

### 6. Start Frontend (new terminal)
```bash
cd ../client
npm run dev
```
Frontend runs on http://localhost:5173

## Access the Application

### Public Website
- Homepage: http://localhost:5173
- About: http://localhost:5173/about
- Services: http://localhost:5173/services
- Contact: http://localhost:5173/contact

### Admin Dashboard
- Login: http://localhost:5173/admin/login
- Dashboard: http://localhost:5173/admin/dashboard

## Test Contact Form

1. Go to http://localhost:5173/contact
2. Fill out the form
3. Submit
4. Login to admin dashboard to view submission

## Common Issues

### MongoDB Connection Error
```bash
# Start MongoDB locally
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## Next Steps

1. Customize branding in `client/src/components/layout/`
2. Update content in `client/src/pages/`
3. Change colors in `client/tailwind.config.js`
4. Update company info in `Footer.jsx`
5. Deploy using `DEPLOYMENT.md` guide

## Production Build

```bash
# Build frontend
cd client
npm run build

# Backend is ready for production
cd ../backend
npm start
```

Enjoy your new business website! 🚀
