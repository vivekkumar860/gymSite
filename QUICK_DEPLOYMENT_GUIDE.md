# 🚀 Quick Deployment Guide

## Current Status
- ✅ Netlify configuration updated (`netlify.toml`)
- ✅ Code pushed to GitHub
- ⏳ Backend needs deployment on Render
- ⏳ Netlify environment variables need update

## Action Required: Complete These Steps

### 1️⃣ Deploy Backend on Render (15-20 minutes)
Open [dashboard.render.com](https://dashboard.render.com) and:

**Create Database:**
```
Name: gymsite-db
Database: gym_fitness
User: gymuser
Region: Oregon (US West)
Plan: Free
```

**Create Web Service:**
```
Repo: vivekkumar860/gymSite
Name: gymsite-backend
Root Dir: backend
Build: npm install && npx prisma generate && npm run build
Start: npm run start:prod
Plan: Free
```

**Add Environment Variables:**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=[your-postgres-external-url]
JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-secret-key-32-chars-minimum
CORS_ORIGIN=https://gymplannerworkout.netlify.app
```

### 2️⃣ Update Netlify Environment Variables (5 minutes)
Open [Netlify Dashboard](https://app.netlify.com/sites/gymplannerworkout/settings/env) and add:

```
NEXT_PUBLIC_API_BASE_URL=https://gymsite-backend.onrender.com
NEXT_PUBLIC_APP_NAME=GymPlanner Workout
NEXT_PUBLIC_APP_URL=https://gymplannerworkout.netlify.app
```

### 3️⃣ Trigger Netlify Redeploy
Two options:

**Option A: Via Dashboard**
1. Go to [Deploys tab](https://app.netlify.com/sites/gymplannerworkout/deploys)
2. Click "Trigger deploy" → "Deploy site"

**Option B: Via Git**
```bash
cd /Users/shubhamkumar/Desktop/vivek/gymSite/gymSite
git commit --allow-empty -m "trigger: netlify redeploy with env vars"
git push origin main
```

### 4️⃣ Verify Everything Works
After both deployments complete:

**Test Backend:**
```bash
curl https://gymsite-backend.onrender.com/health
# Should return: {"status":"ok","database":"connected"}
```

**Test Frontend:**
- Visit: https://gymplannerworkout.netlify.app
- Open browser console (F12) - should have no errors
- Try creating an account or logging in

## ⏱️ Timeline
- Render backend deployment: 10-15 minutes
- Netlify env vars: 2 minutes
- Netlify redeploy: 3-5 minutes
- **Total: ~20-25 minutes**

## 🆘 Troubleshooting

**"Backend not responding"**
- Render free tier sleeps after 15 min
- First request takes 30-60s to wake up
- Check Render logs for errors

**"CORS error in browser"**
- Verify CORS_ORIGIN in Render env vars
- Must be exactly: https://gymplannerworkout.netlify.app

**"Build failed on Netlify"**
- Check build logs
- Verify Node version (needs 20+)
- Check environment variables are set

## 📊 Success Indicators
✅ Backend health check returns OK
✅ No console errors on frontend
✅ Can create account and log in
✅ All features work (workouts, nutrition, etc.)

---

**Need Help?**
- Render Logs: Dashboard → Service → Logs
- Netlify Logs: Dashboard → Functions → Logs
- Backend Direct Test: https://gymsite-backend.onrender.com/health