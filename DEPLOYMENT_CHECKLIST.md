# 📋 Deployment Checklist

## Backend (Render) - DO THIS FIRST!

### ✅ Prerequisites
- [ ] GitHub account connected to Render
- [ ] Render account created (free tier is fine)

### 🗄️ Step 1: Create PostgreSQL Database
1. [ ] Go to [dashboard.render.com](https://dashboard.render.com)
2. [ ] Click "New +" → "PostgreSQL"
3. [ ] Configure:
   - Name: `gymsite-db`
   - Database: `gym_fitness`
   - User: `gymuser`
   - Region: `Oregon (US West)`
   - Plan: `Free`
4. [ ] Click "Create Database"
5. [ ] Wait 2-3 minutes
6. [ ] Copy the **External Database URL** (you'll need this!)

### 🚀 Step 2: Deploy Backend Service
1. [ ] Click "New +" → "Web Service"
2. [ ] Connect GitHub repo: `vivekkumar860/gymSite`
3. [ ] Configure:
   - Name: `gymsite-backend`
   - Region: `Oregon` (same as database!)
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - Plan: `Free`

### 🔐 Step 3: Environment Variables
Add these in the "Environment" tab:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=[YOUR_POSTGRES_EXTERNAL_URL]
JWT_SECRET=use-a-random-32-char-string-here-abcdef123456
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-random-32-char-string-xyz789012
CORS_ORIGIN=https://gymplannerworkout.netlify.app
```

4. [ ] Click "Create Web Service"
5. [ ] Wait for deployment (5-10 minutes)

### 📊 Step 4: Initialize Database
After deployment succeeds:
1. [ ] Go to your service → "Shell" tab
2. [ ] Run: `npx prisma migrate deploy`
3. [ ] (Optional) Run: `npm run prisma:seed` for sample data

### ✔️ Step 5: Verify Backend
- [ ] Visit: https://gymsite-backend.onrender.com/health
- [ ] Should see: `{"status":"ok","database":"connected"}`

---

## Frontend (Netlify) - DO THIS SECOND!

### 🌐 Step 1: Update Environment Variables
1. [ ] Go to [Netlify Dashboard](https://app.netlify.com)
2. [ ] Select your site: `gymplannerworkout`
3. [ ] Go to: Site Settings → Environment Variables
4. [ ] Add these variables:

```
NEXT_PUBLIC_API_BASE_URL=https://gymsite-backend.onrender.com
NEXT_PUBLIC_APP_NAME=GymPlanner Workout
NEXT_PUBLIC_APP_URL=https://gymplannerworkout.netlify.app
```

### 🔄 Step 2: Trigger Redeploy
1. [ ] Go to Deploys tab
2. [ ] Click "Trigger deploy" → "Deploy site"
3. [ ] Wait for build to complete (2-3 minutes)

### ✔️ Step 3: Verify Frontend
- [ ] Visit: https://gymplannerworkout.netlify.app
- [ ] Check browser console for errors (F12)
- [ ] Try logging in or creating an account

---

## 🎯 Final Verification

### Test Full Stack:
1. [ ] Create a new user account
2. [ ] Log in successfully
3. [ ] Create a workout plan
4. [ ] View nutrition tracking
5. [ ] Check that all features work

### Common Issues:

**Backend not responding?**
- Free tier sleeps after 15 min
- First request takes 30-60s to wake up
- Check logs in Render dashboard

**CORS errors?**
- Verify CORS_ORIGIN in backend env vars
- Should be: `https://gymplannerworkout.netlify.app`

**Database connection failed?**
- Check DATABASE_URL is correct
- Ensure database and backend are in same region

---

## 📞 Support

If issues persist:
1. Check Render logs: Dashboard → Service → Logs
2. Check Netlify logs: Dashboard → Functions → Logs
3. Test backend directly: `curl https://gymsite-backend.onrender.com/health`

---

**Time Estimate:**
- Database setup: 5 minutes
- Backend deployment: 10-15 minutes
- Frontend update: 5 minutes
- Total: ~25 minutes