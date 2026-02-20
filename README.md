# MERN Stack Business Website

A production-ready, full-stack business website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a modern design, responsive layout, and admin dashboard.

## 🚀 Features

### Public Website
- **Homepage** - Hero section, features, stats, and call-to-action
- **About Page** - Company information, mission, vision, values, and team
- **Services Page** - Detailed service offerings with descriptions
- **Contact Page** - Contact form with validation (stores submissions in MongoDB)
- **Responsive Design** - Mobile-first, works on all devices
- **SEO Optimized** - Meta tags, Open Graph, and semantic HTML

### Admin Dashboard
- **Secure Login** - JWT-based authentication
- **Dashboard** - View statistics and analytics
- **Submission Management** - View, filter, search, and manage contact submissions
- **Status Updates** - Mark submissions as new, read, replied, or archived
- **Delete Submissions** - Remove unwanted entries

## 📁 Project Structure

```
Brand/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── contactController.js  # Contact form handling
│   │   └── submissionController.js # Submission management
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── Admin.js              # Admin user schema
│   │   └── ContactSubmission.js  # Contact form schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── contactRoutes.js      # Contact endpoints
│   │   └── submissionRoutes.js   # Submission endpoints
│   ├── utils/
│   │   └── seedAdmin.js          # Admin seeding script
│   ├── .env.example
│   ├── server.js                 # Express server entry
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── SEO.jsx       # SEO meta tags component
│   │   │   └── layout/
│   │   │       ├── Footer.jsx    # Site footer
│   │   │       └── Navbar.jsx    # Site navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminLogin.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Services.jsx
│   │   ├── utils/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main app component
│   │   ├── index.css             # Tailwind styles
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Neon PostgreSQL** - Serverless database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Helmet Async** - SEO meta tags
- **Lucide React** - Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- **Neon PostgreSQL account** (free tier available at [neon.tech](https://neon.tech))

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Brand
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Neon database URL
# Get your DATABASE_URL from Neon dashboard
```

#### Get Neon Database URL:

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Copy the connection string (it looks like `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`)
4. Paste it into your `.env` file as `DATABASE_URL`

```bash
# Initialize database tables (optional - auto-creates on first run)
npm run init-db

# Seed admin user
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Default Admin Credentials

After running the seed script:
- **Email:** admin@business.com
- **Password:** admin123

**⚠️ Important:** Change these credentials immediately in production!

## 🌐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Neon PostgreSQL (Get from neon.tech dashboard)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend

Create `.env` in the client folder if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new admin | No |
| POST | /api/auth/login | Admin login | No |
| GET | /api/auth/me | Get current admin | Yes |

### Contact
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/contact | Submit contact form | No |

### Submissions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/submissions | Get all submissions | Yes |
| GET | /api/submissions/stats | Get dashboard stats | Yes |
| GET | /api/submissions/:id | Get single submission | Yes |
| PUT | /api/submissions/:id | Update submission | Yes |
| DELETE | /api/submissions/:id | Delete submission | Yes |

## 🚢 Deployment

### Backend (Heroku/Railway/Render)

1. Set up MongoDB (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy:

```bash
# Example for Heroku
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend (Vercel/Netlify)

1. Set API URL environment variable: `VITE_API_URL`
2. Connect repository and deploy
3. Build command: `npm run build`
4. Output directory: `dist`

### Docker (Optional)

Create `Dockerfile` for backend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🎨 Customization

### Branding
1. Update `client/src/components/layout/Navbar.jsx` - Logo/brand name
2. Update `client/src/components/layout/Footer.jsx` - Company info
3. Update `client/tailwind.config.js` - Color scheme
4. Update meta tags in `client/index.html`

### Content
- Edit page content in `client/src/pages/`
- Update service offerings in `Services.jsx`
- Modify team members in `About.jsx`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd client
npm test
```

## 📝 Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run seed` - Seed admin user

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Input validation with express-validator
- CORS protection
- Helmet security headers
- Rate limiting on API endpoints
- Protected admin routes

## 📊 Database Schema

### Admins Table (PostgreSQL)
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

### Contact Submissions Table (PostgreSQL)
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  ip_address VARCHAR(50) DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure your Neon DATABASE_URL is correct
- Check that your IP address is allowed in Neon settings (or use public access)
- Verify SSL is enabled in the connection string

### CORS Issues
- Ensure CLIENT_URL matches your frontend URL
- Check CORS configuration in server.js

### Port Already in Use
- Change PORT in backend .env
- Update VITE_API_URL in frontend if needed

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@yourbusiness.com

---

Built with ❤️ using the MERN Stack
