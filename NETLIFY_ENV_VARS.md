# Netlify Environment Variables Setup

## Required Environment Variables

Add these in Netlify Dashboard → Site configuration → Environment variables:

### Variable 1:
**Key:** `NEXT_PUBLIC_API_BASE_URL`
**Value:** `https://gymsite-backend.onrender.com`
(Replace with your actual backend URL when deployed, or use a mock API for now)

### Variable 2:
**Key:** `NEXT_PUBLIC_APP_NAME`
**Value:** `GymPlanner`

### Variable 3:
**Key:** `NEXT_PUBLIC_APP_URL`
**Value:** `https://gymplannerworkout.netlify.app`
(This will be your Netlify site URL)

## For Testing Without Backend:

If you want to deploy frontend-only first (without backend), use:

**Key:** `NEXT_PUBLIC_API_BASE_URL`
**Value:** `https://jsonplaceholder.typicode.com`
(This is a mock API for testing)

## How to Add in Netlify:

1. Go to your site dashboard
2. Click "Site configuration" in the left sidebar
3. Click "Environment variables"
4. Click "Add a variable"
5. Enter the Key and Value
6. Click "Create variable"
7. Repeat for all three variables
8. Redeploy your site for changes to take effect