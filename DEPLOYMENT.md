# Deployment Guide - Railway

## Prerequisites
- GitHub account
- Railway account
- MySQL database (Railway provides this)

## Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Ensure all files are committed**
   - `package.json` (with build scripts)
   - `railway.json` (Railway configuration)
   - `scripts/deploy.js` (deployment script)
   - All source code

## Step 2: Deploy to Railway

### 2.1 Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Click "Deploy Now"

### 2.2 Add MySQL Database
1. In your Railway project dashboard
2. Click "Add Plugin"
3. Search for "MySQL"
4. Click "Add MySQL"
5. Railway will create a MySQL database and provide connection details

### 2.3 Configure Environment Variables
1. Go to your project's "Variables" tab
2. Add the following environment variables:

```
DATABASE_URL=mysql://user:password@host:port/database
PORT=8080
NODE_ENV=production
SESSION_SECRET=your_random_session_secret
```

**Note:** Railway will automatically provide the `DATABASE_URL` when you add the MySQL plugin.

### 2.4 Deploy
1. Railway will automatically detect the build process from `package.json`
2. The build command will be: `npm run build`
3. The start command will be: `npm start`
4. Railway will deploy your application

## Step 3: Database Setup

After deployment, you need to set up the database:

1. **Run Migrations**
   - Go to your Railway project
   - Click on "Deployments"
   - Find your latest deployment
   - Click "View Logs"
   - Check if migrations ran successfully

2. **If migrations failed**, you can run them manually:
   - Go to "Settings" → "Shell"
   - Run: `npx drizzle-kit push`

3. **Seed Database** (if needed):
   - The deployment script should handle seeding automatically
   - Check logs for any seeding errors

## Step 4: Verify Deployment

1. **Check Application URL**
   - Railway will provide a URL like: `https://your-app.up.railway.app`
   - Visit the URL to ensure the app loads

2. **Test API Endpoints**
   - Test: `https://your-app.up.railway.app/api/profile`
   - Should return profile data

3. **Test Admin Login**
   - Go to: `https://your-app.up.railway.app/admin`
   - Login with: `admin` / `admin123`

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Railway build logs
   - Ensure all dependencies are in `package.json`
   - Verify build scripts are correct

2. **Database Connection Fails**
   - Verify `DATABASE_URL` is set correctly
   - Check if MySQL plugin is added
   - Ensure database is running

3. **App Won't Start**
   - Check Railway logs
   - Verify `PORT` environment variable
   - Ensure `NODE_ENV=production`

4. **Static Files Not Loading**
   - Verify Vite build completed successfully
   - Check if `dist/public` directory exists
   - Ensure `serveStatic` function works correctly

### Useful Commands

```bash
# Check build locally
npm run build

# Test production build locally
npm start

# Check database connection
npx drizzle-kit studio
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `PORT` | Server port (Railway sets this) | No |
| `NODE_ENV` | Environment (production) | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |

## Support

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test locally with production build
4. Check database connectivity 