# Deployment Guide for GymSite on Netlify

## Prerequisites
- Netlify account
- GitHub repository connected to Netlify
- Backend API deployed separately (e.g., on Render, Heroku, or Railway)

## Deployment Steps

### 1. Backend Deployment (Required First)
Since this is a full-stack application, you need to deploy the backend first:

Options for backend hosting:
- **Render.com** (Recommended - Free tier available)
- **Railway.app**
- **Heroku**
- **DigitalOcean App Platform**

The backend uses:
- NestJS framework
- PostgreSQL database
- Prisma ORM

### 2. Frontend Deployment on Netlify

#### Step 1: Configure Environment Variables
In your Netlify dashboard, add these environment variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
NEXT_PUBLIC_APP_NAME=FitTrack
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

#### Step 2: Deploy to Netlify

**Option A: Deploy via Netlify UI**
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `out`
3. Deploy

**Option B: Deploy via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link your site
cd gymSite
netlify init

# Deploy
netlify deploy --prod
```

#### Step 3: Configure API Redirects
The `netlify.toml` file already includes redirect rules for API calls. Update the backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-url.com/api/:splat"
  status = 200
  force = true
```

## Important Notes

1. **Static Export**: The frontend is configured as a static export (`output: "export"` in next.config.ts), which is perfect for Netlify hosting.

2. **API Integration**: Since the backend is separate, all API calls will be proxied through Netlify redirects to avoid CORS issues.

3. **Environment Variables**: Make sure to update the environment variables in Netlify dashboard to match your actual backend URL.

4. **Backend First**: Deploy the backend before the frontend to ensure API endpoints are available.

## Testing Locally

Before deploying, test the build locally:

```bash
cd frontend
npm install
npm run build
# This will create an 'out' directory with static files
```

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Environment variables are correctly set in Netlify
- [ ] API redirects are working
- [ ] Authentication flow works
- [ ] Database connection is established
- [ ] All pages load correctly

## Troubleshooting

1. **Build Failures**: Check Node version (should be 20+)
2. **API Connection Issues**: Verify CORS settings in backend
3. **404 Errors**: Ensure redirects are properly configured
4. **Environment Variables**: Double-check all variables are set in Netlify dashboard