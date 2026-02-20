# Neon PostgreSQL Setup Guide

This guide will help you set up Neon serverless PostgreSQL database for the H&E Works website.

## What is Neon?

Neon is a serverless PostgreSQL database service that offers:
- **Free tier**: 0.5 GB storage, perfect for development
- **Auto-scaling**: Scales to zero when not in use
- **Branching**: Create database branches like Git branches
- **Global edge**: Low latency worldwide

## Step-by-Step Setup

### 1. Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"**
3. Sign up with GitHub, Google, or Email
4. Complete the onboarding process

### 2. Create a New Project

1. Click **"New Project"** button
2. Enter project name: `H&E Works Database`
3. Choose a region closest to your users:
   - **US East** (N. Virginia) - Recommended for US
   - **Europe** (Frankfurt) - For EU users
   - **Asia** (Singapore) - For Asian users
4. Click **"Create Project"**

### 3. Get Connection String

1. On the project dashboard, find **"Connection Details"**
2. Click **"Copy"** to copy the connection string
3. It will look like:
   ```
   postgresql://username:password@ep-cool-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 4. Configure Backend

1. Navigate to your backend folder:
   ```bash
   cd /home/huzaifa/Desktop/Brand/backend
   ```

2. Open the `.env` file:
   ```bash
   nano .env
   ```

3. Replace the `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-cool-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

4. Save and exit (Ctrl+X, Y, Enter)

### 5. Initialize Database

The database tables will be created automatically when you start the server. Alternatively, you can manually initialize:

```bash
cd backend
npm run init-db
```

### 6. Seed Admin User

```bash
npm run seed
```

This creates the default admin account:
- **Email:** admin@business.com
- **Password:** admin123

### 7. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Connected to Neon PostgreSQL
✅ Database tables created successfully!
Server running in development mode on port 5000
```

## Neon Dashboard Features

### Database Browser
- View tables directly in the browser
- Run SQL queries
- Import/Export data

### Branching
- Create development branches
- Test changes without affecting production
- Merge branches when ready

### Connection Pooling
- Automatically managed
- No configuration needed
- Scales based on demand

### Monitoring
- View query performance
- Monitor connection count
- Track storage usage

## Security Best Practices

### 1. Environment Variables
Never commit your `.env` file to Git. The `.gitignore` already includes it.

### 2. Connection String Security
- Keep your connection string private
- Use different databases for development/production
- Rotate passwords periodically

### 3. IP Allowlisting (Optional)
By default, Neon allows connections from anywhere. For production:

1. Go to Project Settings → **Allowed IPs**
2. Add your server's IP address
3. Click **"Save"**

## Troubleshooting

### Connection Timeout
**Problem:** Can't connect to database

**Solutions:**
1. Check if your connection string is correct
2. Ensure `sslmode=require` is in the connection string
3. Check if your IP is blocked (try disabling IP allowlisting)

### SSL Error
**Problem:** SSL connection errors

**Solution:**
Make sure your connection string includes `?sslmode=require` at the end.

### Table Not Found
**Problem:** Tables don't exist

**Solution:**
```bash
npm run init-db
```

### Authentication Failed
**Problem:** Password authentication failed

**Solution:**
1. Reset password in Neon dashboard
2. Update `.env` with new connection string
3. Restart the server

## Migration from MongoDB

The backend has been updated to use PostgreSQL. Key changes:

| MongoDB | PostgreSQL (Neon) |
|---------|------------------|
| Mongoose | node-postgres (pg) |
| Documents | Rows |
| Collections | Tables |
| ObjectId | SERIAL (Auto-increment) |
| isActive | is_active (snake_case) |

## Pricing

### Free Tier (Hobby)
- ✅ 0.5 GB storage
- ✅ Unlimited compute hours
- ✅ 3 projects
- ✅ Community support

### Pro ($19/month)
- ✅ 5 GB storage
- ✅ Priority support
- ✅ More branches
- ✅ Advanced monitoring

## Useful Links

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon GitHub](https://github.com/neondatabase/neon)
- [Community Discord](https://discord.gg/neon)

## Next Steps

1. ✅ Set up Neon database
2. ✅ Configure `.env` file
3. ✅ Run `npm run seed`
4. ✅ Test API endpoints
5. ✅ Deploy to production

---

**Need Help?** Contact: khuzaifa442@gmail.com
