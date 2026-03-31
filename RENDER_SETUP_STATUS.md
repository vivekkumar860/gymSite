# Render Deployment Status

## ✅ Completed Setup

### 1. Render MCP Connected
- API Key configured: `rnd_AYSp...r5de`
- MCP integration added to Claude

### 2. Monitoring Scripts Created
- `scripts/render-monitor.js` - Check service status
- `backend/scripts/debug.js` - Debug database and environment

### 3. Health Check Endpoints
Your backend already has health endpoints configured:
- `/health` - Full system health
- `/health/ready` - Database readiness
- `/health/live` - Process liveness

## 📋 Next Steps for Render Deployment

### Step 1: Create PostgreSQL Database on Render
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `gymsite-db`
   - Database: `gym_fitness`
   - User: `gymuser`
   - Region: Oregon (US West)
   - Plan: Free
4. Click "Create Database"
5. Wait 2-3 minutes for creation
6. Copy the **External Database URL** from the database info page

### Step 2: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub: `vivekkumar860/gymSite`
3. Configure:
   - **Name:** `gymsite-backend`
   - **Region:** Same as database (Oregon)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

### Step 3: Add Environment Variables
Click "Environment" and add:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=[paste your PostgreSQL External URL here]
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-super-secret-refresh-token-key
CORS_ORIGIN=https://gymplannerworkout.netlify.app
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://gymsite-backend.onrender.com`

### Step 5: Initialize Database
After deployment succeeds:
1. Go to your service → "Shell" tab
2. Run:
```bash
npx prisma migrate deploy
npm run prisma:seed  # optional - adds sample data
```

### Step 6: Update Netlify Frontend
1. Go to Netlify dashboard
2. Update environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://gymsite-backend.onrender.com`
3. Trigger redeploy

## 🔍 Monitoring Your Deployment

### Check Service Status
```bash
node scripts/render-monitor.js
```

### Debug Issues
In Render Shell:
```bash
node scripts/debug.js
```

### View Logs
- Render Dashboard → Your Service → Logs tab

### Test Health
```bash
curl https://gymsite-backend.onrender.com/health
```

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Services sleep after 15 min of inactivity
   - First request takes 30-60 seconds to wake
   - 750 hours/month (enough for 1 service running 24/7)

2. **Database Free Tier:**
   - 1 GB storage
   - Expires after 90 days (needs manual renewal)

3. **If deployment fails:**
   - Check build logs in Render dashboard
   - Verify all environment variables are set
   - Ensure DATABASE_URL is correct
   - Run `node scripts/debug.js` in Shell

## 🚀 Estimated Time
- Database setup: 5 minutes
- Backend deployment: 10-15 minutes
- Total: ~20 minutes

Once deployed, your full-stack app will be live at:
- Frontend: https://gymplannerworkout.netlify.app
- Backend API: https://gymsite-backend.onrender.com