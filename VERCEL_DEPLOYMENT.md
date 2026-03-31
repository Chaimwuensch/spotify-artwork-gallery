# Vercel Deployment Guide

This guide explains how to deploy the Spotify Artwork Gallery on Vercel with both frontend and backend.

## Prerequisites
- Vercel account (free: https://vercel.com)
- GitHub account with your repository pushed
- Environment variables prepared

## Deployment Strategy

This app uses **separate deployments** for frontend and backend:
- **Frontend**: React + Vite app → Vercel (automatic HTTPS)
- **Backend**: Express API → Vercel (serverless Node.js)

---

## Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy the Backend

### 2a. Create a new Vercel project for the backend

1. Go to https://vercel.com/new
2. Select "Other" → "CLI" (or connect your GitHub repository)
3. For **Project Name**: `spotify-artwork-backend`
4. For **Root Directory**: Choose `server`
5. Click "Deploy"

### 2b. Add Environment Variables to Backend

After deployment, go to your backend project settings:
1. Navigate to **Settings** → **Environment Variables**
2. Add these environment variables:
   - `SPOTIFY_CLIENT_ID` = Your Spotify Client ID (from Spotify Developer Dashboard)
   - `SPOTIFY_CLIENT_SECRET` = Your Spotify Client Secret (from Spotify Developer Dashboard)
   - `SPOTIFY_REDIRECT_URI` = `https://your-frontend-domain.vercel.app/callback`
   - `HUGGINGFACE_API_KEY` = Your HuggingFace API token (from `.env.local`)
   - `CORS_ORIGIN` = `https://your-frontend-domain.vercel.app` (set after frontend is deployed)
   - `PORT` = `3001` (Vercel ignores this, but keep it)

3. Click "Save" and redeploy

### 2c. Get Your Backend URL

After deployment completes:
- Your backend will be at: `https://your-backend-project.vercel.app`
- Test it: `https://your-backend-project.vercel.app/api/generate-art` (should give CORS error, which is expected)

**Save this URL** - you'll need it for the frontend.

---

## Step 3: Deploy the Frontend

### 3a. Create a new Vercel project for the frontend

1. Go to https://vercel.com/new
2. Select your GitHub repository
3. For **Project Name**: `spotify-artwork-frontend`
4. For **Root Directory**: Choose `client`
5. Click "Deploy"

### 3b. Add Environment Variables to Frontend

After deployment, go to your frontend project settings:
1. Navigate to **Settings** → **Environment Variables**
2. Add these variables:
   - `VITE_SPOTIFY_CLIENT_ID` = Your Spotify Client ID (from your `.env.local` or Spotify Developer Dashboard)
   - `VITE_SPOTIFY_REDIRECT_URI` = `https://your-frontend-domain.vercel.app/callback`
   - `VITE_API_BASE_URL` = `https://your-backend-domain.vercel.app`

3. Click "Save" and Vercel will redeploy automatically

### 3c. Update Spotify OAuth Redirect URI

Since you now have a production frontend URL, update your Spotify Developer Dashboard:
1. Go to https://developer.spotify.com/dashboard
2. Edit your app settings
3. Update **Redirect URIs**:
   - Keep: `http://127.0.0.1:5173/callback` (for local development)
   - Add: `https://your-frontend-domain.vercel.app/callback` (for production)

---

## Step 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to your backend Vercel project → Settings → Environment Variables
2. Update `CORS_ORIGIN` with your actual frontend URL
3. Redeploy

---

## Step 5: Test Everything

1. Navigate to your frontend: `https://your-frontend-domain.vercel.app`
2. Click "Login with Spotify"
3. Authorize the app
4. Try generating artwork
5. Test saving and sharing

---

## Troubleshooting

### "CORS error" when generating art
- Check backend `CORS_ORIGIN` environment variable
- Make sure `VITE_API_BASE_URL` in frontend matches your backend URL
- Redeploy after changing environment variables

### "Invalid redirect URI" on Spotify login
- Verify the frontend URL matches your Spotify app Redirect URIs
- Allow 5-10 minutes for changes to take effect

### Backend endpoints return 404
- Check that the `vercel.json` exists in the `server/` folder
- Verify `Root Directory` is set to `server` in Vercel project settings

### HuggingFace rate limit errors
- The free token is limited to ~3 requests/minute
- For higher limits, get a paid HuggingFace token and update the environment variable

---

## Environment Variables Summary

### Backend (.env)
```
PORT=3001
CORS_ORIGIN=https://your-frontend.vercel.app
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### Frontend (.env.local)
```
VITE_SPOTIFY_CLIENT_ID=9500256483f54974a48bbbb847aa8f9e
VITE_SPOTIFY_REDIRECT_URI=https://your-frontend.vercel.app/callback
VITE_API_BASE_URL=https://your-backend.vercel.app
```

---

## Local Development (after deployment)

To run locally with production URLs for testing:

```bash
# Frontend
cd client
npm install
npm run dev  # Uses port 5173

# Backend (in another terminal)
cd server
npm install
npm run dev  # Uses port 3001
```

Create `.env.local` files in both directories with the environment variables above (keeping `VITE_SPOTIFY_REDIRECT_URI` as `http://localhost:5173/callback` for local dev).

---

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [Express on Vercel](https://vercel.com/docs/serverless-functions/nodejs)
- [Spotify OAuth Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
