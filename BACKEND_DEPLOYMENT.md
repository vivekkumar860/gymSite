# Backend Deployment Guide

## Option 1: Deploy on Render.com (Recommended - FREE)

### Step 1: Database Setup (PostgreSQL)
1. Go to [Render.com](https://render.com) and sign up
2. Create a **PostgreSQL database**:
   - Click "New +" → "PostgreSQL"
   - Name: `gymsite-db`
   - Region: Choose nearest to you
   - Plan: **Free** (sufficient for testing)
   - Click "Create Database"
   - Copy the **External Database URL** (you'll need this)

### Step 2: Deploy Backend
1. In Render, click "New +" → "Web Service"
2. Connect your GitHub repository (`vivekkumar860/gymSite`)
3. Configure:
   - **Name:** `gymsite-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run prisma:generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** **Free**

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=[Your PostgreSQL External URL from Step 1]
   JWT_SECRET=your-random-32-character-secret-key-here
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_SECRET=another-random-32-character-secret
   CORS_ORIGIN=https://gymplannerworkout.netlify.app
   ```

5. Click "Create Web Service"

### Step 3: Initialize Database
After deployment, in Render dashboard:
1. Go to your web service → "Shell" tab
2. Run: `npx prisma migrate deploy`
3. Run: `npm run prisma:seed` (optional, adds sample data)

## Option 2: Deploy on Railway.app (Easy but Paid)

### Quick Deploy:
1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects NestJS and PostgreSQL
6. Add environment variables (same as above)
7. Deploy!

## Option 3: Deploy on Heroku (Requires Credit Card)

### Prerequisites:
- Heroku CLI installed
- Credit card for verification (even for free tier)

### Steps:
```bash
# In backend directory
cd backend

# Create Procfile
echo "web: npm run start:prod" > Procfile
echo "release: npx prisma migrate deploy" >> Procfile

# Initialize Heroku
heroku create gymsite-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:essential

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRES_IN=15m
heroku config:set REFRESH_TOKEN_SECRET=your-refresh-secret
heroku config:set CORS_ORIGIN=https://gymplannerworkout.netlify.app

# Deploy
git push heroku main
```

## Environment Variables Needed

```env
# Required for all platforms
NODE_ENV=production
PORT=3001 (or platform default)
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=generate-random-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=generate-random-32-chars
CORS_ORIGIN=https://gymplannerworkout.netlify.app
```

## After Deployment

1. **Update Netlify Frontend:**
   - Go to Netlify dashboard
   - Update `NEXT_PUBLIC_API_BASE_URL` to your backend URL
   - Example: `https://gymsite-backend.onrender.com`

2. **Test API:**
   ```bash
   curl https://your-backend-url.com/health
   ```

3. **Monitor Logs:**
   - Render: Dashboard → Logs
   - Railway: Dashboard → Deployments → View Logs
   - Heroku: `heroku logs --tail`

## Estimated Time

- **Render.com:** 15-20 minutes
- **Railway:** 10-15 minutes
- **Heroku:** 20-30 minutes

## Troubleshooting

### Database Connection Issues:
- Check DATABASE_URL format
- Ensure SSL is enabled: `?sslmode=require`

### CORS Errors:
- Update CORS_ORIGIN to match your frontend URL
- Include `https://` in the URL

### Build Failures:
- Check Node version (needs 18+)
- Ensure all dependencies are in package.json
- Check build logs for specific errors