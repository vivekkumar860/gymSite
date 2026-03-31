# Netlify Deployment Fix Guide

## Current Issues
1. Backend API is not deployed yet
2. Frontend is trying to connect to placeholder URLs
3. Environment variables need to be configured on Netlify

## Solution Steps

### Step 1: Deploy Backend to Render First
Before the frontend can work, you need to deploy the backend. Follow the instructions in `RENDER_SETUP_STATUS.md`:

1. **Create PostgreSQL Database on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Create a new PostgreSQL database named `gymsite-db`
   - Copy the External Database URL

2. **Deploy Backend Service**
   - Create a new Web Service on Render
   - Connect GitHub repo: `vivekkumar860/gymSite`
   - Set root directory: `backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=3001
     DATABASE_URL=[your-postgres-url]
     JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
     JWT_EXPIRES_IN=15m
     REFRESH_TOKEN_SECRET=another-super-secret-refresh-token-key
     CORS_ORIGIN=https://gymplannerworkout.netlify.app
     ```

3. **Wait for Deployment**
   - This takes 10-15 minutes
   - Your backend will be at: `https://gymsite-backend.onrender.com`

### Step 2: Update Netlify Environment Variables
Once backend is deployed:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `gymplannerworkout`
3. Go to Site Settings → Environment Variables
4. Add these variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://gymsite-backend.onrender.com
   NEXT_PUBLIC_APP_NAME=GymPlanner Workout
   NEXT_PUBLIC_APP_URL=https://gymplannerworkout.netlify.app
   ```

### Step 3: Deploy to Netlify

**Option A: Using Netlify CLI (Recommended)**
```bash
cd /Users/shubhamkumar/Desktop/vivek/gymSite/gymSite
netlify deploy --prod --dir=frontend/.next
```

**Option B: Using Git Push**
```bash
git add .
git commit -m "fix: update API URLs for production deployment"
git push origin main
```

### Step 4: Verify Deployment
After deployment:
1. Check backend health: `curl https://gymsite-backend.onrender.com/health`
2. Visit frontend: https://gymplannerworkout.netlify.app
3. Open browser console to check for errors

## Important Notes

### Backend Not Ready Yet?
If you haven't deployed the backend yet, the frontend will show errors. You can:
1. Deploy a mock API temporarily
2. Or wait until backend is ready

### Free Tier Limitations
- **Render backend** sleeps after 15 min inactivity (first request takes 30-60s to wake)
- **Netlify frontend** has 100GB bandwidth/month on free tier

### Testing Locally First
```bash
cd frontend
# Create .env.local with:
echo "NEXT_PUBLIC_API_BASE_URL=https://gymsite-backend.onrender.com
NEXT_PUBLIC_APP_NAME=GymPlanner Workout
NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env.local

npm run build
npm run start
# Visit http://localhost:3000
```

## Troubleshooting

### "API Connection Failed" Error
- Backend is not deployed or sleeping
- Check CORS settings in backend
- Verify environment variables in Netlify

### Build Failures
- Check Node version (needs v20+)
- Run `npm ci` instead of `npm install`
- Check build logs in Netlify dashboard

### 404 Errors on Routes
- Next.js routing issue
- Check `netlify.toml` configuration
- Ensure `@netlify/plugin-nextjs` is installed

## Current Configuration Status
✅ `netlify.toml` updated with correct URLs
✅ Build settings configured
⏳ Waiting for backend deployment
⏳ Netlify environment variables need updating