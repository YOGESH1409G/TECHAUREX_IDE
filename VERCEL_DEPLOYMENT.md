# 🚀 Vercel Deployment Guide - TechAurex Frontend

Complete guide to deploy TechAurex frontend to Vercel.

## ✅ Pre-Deployment Checklist

- [x] Backend deployed to Render (see `RENDER_DEPLOYMENT.md`)
- [x] Backend URL noted (e.g., `https://techaurex-backend.onrender.com`)
- [x] Frontend code fixes applied
- [x] `vercel.json` configuration created
- [x] Environment variables ready (see `VERCEL_ENV_VARS.md`)

---

## 📦 What's Already Configured

### ✅ Build Configuration
- **Framework**: Vite (auto-detected by Vercel)
- **Build Command**: `npm run build` (already in `package.json`)
- **Output Directory**: `dist` (already configured in `vite.config.js`)
- **Install Command**: `npm install`

### ✅ Production Optimizations
- ✅ Code splitting for large dependencies (Monaco Editor, Socket.IO)
- ✅ Minification enabled
- ✅ Console logs removed from production builds
- ✅ SPA routing configured in `vercel.json`
- ✅ Static asset caching (1 year immutable)

### ✅ Critical Fixes Applied
- ✅ Removed hardcoded API fetch calls
- ✅ Environment variable configuration added
- ✅ Enhanced SEO meta tags
- ✅ Development-only console logging

---

## 🌐 Step-by-Step Deployment

### Step 1: Prerequisites

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with **GitHub** (recommended for auto-deploy)
   - Verify your email

2. **Install Vercel CLI** (Optional)
   ```bash
   npm install -g vercel
   ```

### Step 2: Deploy from GitHub (Recommended)

1. **Push Frontend Changes to GitHub**
   ```bash
   # From project root
   git add frontend/
   git commit -m "Prepare frontend for Vercel deployment"
   git push origin main
   ```

2. **Connect Vercel to GitHub**
   - Go to https://vercel.com/new
   - Click **"Import Git Repository"**
   - Authorize Vercel to access your GitHub
   - Select your **TechAurex repository**

3. **Configure Project Settings**
   ```yaml
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add each variable from `VERCEL_ENV_VARS.md`:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com` | Production, Preview, Development |
   | `VITE_SOCKET_URL` | `https://YOUR-RENDER-URL.onrender.com` | Production, Preview, Development |

   ⚠️ **IMPORTANT**: Replace `YOUR-RENDER-URL` with your actual Render service URL

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Note your deployment URL: `https://techaurex-XXXXX.vercel.app`

### Step 3: Alternative - Deploy via CLI

```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? techaurex-frontend
# - In which directory is your code? ./
# - Override settings? N

# Add environment variables
vercel env add VITE_API_URL
# Enter: https://YOUR-RENDER-URL.onrender.com

vercel env add VITE_SOCKET_URL
# Enter: https://YOUR-RENDER-URL.onrender.com

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### Step 1: Update Backend CORS Settings

Your backend needs to allow requests from Vercel.

1. Go to **Render Dashboard** → Your Backend Service → **Environment**
2. Update `CLIENT_URL` variable:
   ```env
   CLIENT_URL=https://your-vercel-deployment.vercel.app
   ```
3. Click **"Save Changes"** → Render will auto-redeploy

### Step 2: Update OAuth Callback URLs (if using OAuth)

#### Google OAuth Console (if enabled)
1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client
3. **Authorized redirect URIs**: Add
   ```
   https://your-render-backend.onrender.com/api/v1/oauth/google/callback
   ```
4. Save changes

#### GitHub OAuth Settings (if enabled)
1. Go to https://github.com/settings/developers
2. Select your OAuth App
3. **Authorization callback URL**: Update to
   ```
   https://your-render-backend.onrender.com/api/v1/oauth/github/callback
   ```
4. Save changes

### Step 3: Verify Deployment

1. **Test Frontend Loads**
   ```bash
   curl -I https://your-vercel-deployment.vercel.app
   # Should return: 200 OK
   ```

2. **Open in Browser**
   - Go to your Vercel URL
   - Should see TechAurex landing page
   - Check browser console (F12) for errors

3. **Test API Connection**
   - Try to sign up with email/password
   - Check Network tab for API calls
   - Verify requests go to Render backend URL

4. **Test Socket.IO Connection**
   - Login to application
   - Open Chat panel
   - Create a room
   - Check console for "Socket connected" message
   - Send a message to verify real-time communication

---

## 🔍 Troubleshooting

### ❌ Build Fails with "VITE_API_URL is not defined"

**Problem**: Environment variables not set in Vercel

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `VITE_API_URL` and `VITE_SOCKET_URL`
3. Redeploy: **Deployments** → Latest → **Redeploy**

### ❌ CORS Error: "Blocked by CORS policy"

**Problem**: Backend `CLIENT_URL` doesn't match Vercel URL

**Solution**:
1. Go to Render Dashboard → Backend Service → Environment
2. Update `CLIENT_URL=https://your-vercel-url.vercel.app`
3. Re-deploy backend
4. Wait 2-3 minutes for backend to restart

### ❌ Socket.IO Connection Failed

**Problem**: `VITE_SOCKET_URL` pointing to wrong URL

**Solution**:
1. Check Vercel environment variables
2. `VITE_SOCKET_URL` must match exact Render backend URL
3. No trailing slash: ✅ `https://backend.onrender.com` ❌ `https://backend.onrender.com/`
4. Redeploy Vercel after fixing

### ❌ 404 on Page Refresh

**Problem**: SPA routing not configured (but we already created `vercel.json`)

**Verification**:
```bash
# Check vercel.json exists
cat frontend/vercel.json
```

Should contain:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### ❌ API Calls Fail with 401 Unauthorized

**Problem**: JWT token issues or different domains

**Solution**:
1. Check backend logs in Render
2. Verify cookies are being sent (check Network tab → Request Headers)
3. Ensure `CORS_ORIGIN` in backend includes Vercel URL
4. Try clearing browser cookies and login again

### ❌ Slow Initial Load

**Problem**: Render backend in sleep mode (free tier)

**Expected Behavior**:
- First request: 30-60 seconds (backend waking up)
- Subsequent requests: Fast

**Solutions**:
- Upgrade Render to paid plan ($7/month for always-on)
- Use cron-job.org to ping backend every 14 minutes
- Accept cold starts on free tier

---

## 📊 Vercel Dashboard Features

### Deployments
- Every `git push` triggers automatic deployment
- Preview deployments for branches
- Rollback to previous deployments with one click

### Analytics
- Go to **Analytics** tab
- See page views, unique visitors
- Track Web Vitals (LCP, FID, CLS)

### Logs
- Go to **Deployments** → Select deployment → **Functions** → **Logs**
- View build logs and runtime logs
- Filter by severity (info, error, warning)

### Domains
- Go to **Settings** → **Domains**
- Add custom domain (e.g., `techaurex.com`)
- Vercel provides free SSL certificates

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `VERCEL_ENV_VARS.md` to Git
   - Use Vercel dashboard to manage secrets
   - Different values for Preview/Production if needed

2. **HTTPS Only**
   - Vercel enforces HTTPS automatically
   - Check backend also uses HTTPS (Render does)

3. **Content Security Policy**
   - Add CSP headers in `vercel.json` if needed
   - Monaco Editor requires `'unsafe-eval'` for workers

4. **Rate Limiting**
   - Already configured in backend middleware
   - Vercel also has built-in DDoS protection

---

## 🚀 Continuous Deployment

### Auto-Deploy Setup (Already Enabled)

Every push to `main` branch triggers:
1. Vercel pulls latest code
2. Installs dependencies
3. Builds production bundle
4. Deploys to production URL
5. Previous deployment remains accessible

### Preview Deployments

Create a feature branch:
```bash
git checkout -b feature/new-chat-ui
# Make changes
git push origin feature/new-chat-ui
```

Vercel automatically creates preview URL:
- `https://techaurex-git-feature-new-chat-ui-yourname.vercel.app`
- Test changes before merging to `main`

---

## 📝 Environment Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `https://api.onrender.com` | Backend REST API base URL |
| `VITE_SOCKET_URL` | ✅ Yes | `https://api.onrender.com` | Socket.IO server URL |

**Notes**:
- Both URLs should point to same backend
- Must start with `VITE_` prefix (Vite requirement)
- No trailing slashes
- No `/api/v1` suffix (axios adds it automatically)

---

## 🎯 Next Steps

1. ✅ **Frontend Deployed**: Your app is now live!
2. 🔧 **Update Backend**: Set `CLIENT_URL` to Vercel URL
3. 🔐 **Update OAuth**: Update callback URLs (if using)
4. 🧪 **Test Everything**:
   - Signup/Login
   - Create room
   - Send messages
   - Invite users
   - OAuth login (if configured)
5. 📊 **Monitor**: Watch Vercel Analytics and Render logs
6. 🌐 **Custom Domain** (Optional): Add your own domain in Vercel settings

---

## 🆘 Getting Help

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/chat
- Questions: https://github.com/vercel/vercel/discussions

### Project-Specific Issues
- Check backend logs in Render dashboard
- Check browser console for frontend errors
- Verify environment variables match exactly
- Test Socket.IO connection separately

---

## 📅 Maintenance

### Regular Updates
```bash
# Update dependencies
cd frontend
npm update

# Test locally
npm run dev

# Push to deploy
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Monitoring
- Check Vercel Analytics weekly
- Review error logs in Vercel dashboard
- Monitor backend performance in Render
- Test critical flows (signup, chat) monthly

---

**Deployment Date**: 2026-02-25  
**Version**: 1.0.0  
**Stack**: React 19 + Vite 7 + Vercel
