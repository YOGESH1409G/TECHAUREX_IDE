# 🚀 Backend Deployment to Render - Step-by-Step Guide

## ✅ Pre-Deployment Checklist

All code fixes have been applied:
- ✅ Added Node.js engines specification (>=18.0.0)
- ✅ Added @socket.io/redis-adapter dependency
- ✅ Fixed direct process.env access in auth/token services
- ✅ Replaced all console.log with logger
- ✅ Improved Redis adapter error handling
- ✅ Generated production-grade JWT secrets

## 📋 Step 1: MongoDB Atlas Setup

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Network Access**:
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**
   - ⚠️ This allows Render to connect. For enhanced security, use Render's IP ranges post-deployment.

3. **Database Connection String**:
   - Your current MONGO_URI is already set up
   - Verify it's accessible: `mongodb+srv://Yogesh:Yogesh14@cluster0.6doahm3.mongodb.net/ROOM?retryWrites=true&w=majority`

## 📋 Step 2: Update OAuth Redirect URLs (After Deployment)

### Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://techaurex-backend.onrender.com/api/v1/oauth/google/callback
   ```
4. Save changes

### GitHub OAuth Settings
1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update **Authorization callback URL**:
   ```
   https://techaurex-backend.onrender.com/api/v1/oauth/github/callback
   ```
4. Save

## 📋 Step 3: Create Render Web Service

### 3.1 Initial Setup
1. Go to **Render Dashboard**: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. **Connect GitHub**:
   - Click **"Connect account"** 
   - Authorize GitHub access
   - Select repository: `YOGESH1409G/TECHAUREX_IDE`

### 3.2 Configure Service

**Basic Settings:**
```
Name: techaurex-backend
Region: Oregon (US West) or closest to your users
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Plan: Free
```

## 📋 Step 4: Add Environment Variables

In the Render dashboard, scroll to **Environment** section and add these variables one by one:

### 🔐 Required Variables

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://Yogesh:Yogesh14@cluster0.6doahm3.mongodb.net/ROOM?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=4000

# Client URL - UPDATE AFTER VERCEL DEPLOYMENT
CLIENT_URL=http://localhost:5173

# JWT Secrets - PRODUCTION SECRETS
JWT_ACCESS_SECRET=ab9783e0f1803e0f51d94c91aa51f6ad91ba194d934967079993bfd18749b938df52d1171885803df9fda17c7eb7b2596cd3da735dc682161a689a10d0d0a145d
JWT_REFRESH_SECRET=678560dce876b1b3b6ae1cb157c0c1c0dfe0a470ddaa5557e6cff539be76cf946418165ece4a900e8948c8b747b55866cdc15701ee4be35a1f8ac9edae287dcd
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Email Service - Brevo
BREVO_API_KEY=xkeysib-YOUR_BREVO_API_KEY_HERE
BREVO_SENDER_EMAIL=your-verified-email@gmail.com
BREVO_SENDER_NAME=TechAurex

# File Uploads - Cloudinary
CLOUDINARY_URL=cloudinary://YOUR_CLOUDINARY_URL_HERE

# Redis Configuration
USE_REDIS=false
```

### 🔧 OAuth Variables (Optional - Configure URLs after deployment)

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=https://techaurex-backend.onrender.com/api/v1/oauth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
GITHUB_CALLBACK_URL=https://techaurex-backend.onrender.com/api/v1/oauth/github/callback
```

## 📋 Step 5: Deploy

1. **Click "Create Web Service"**
2. **Monitor Build Logs**:
   - Watch the deployment process in real-time
   - Look for successful build completion
   - Typical deployment time: 5-10 minutes

3. **Wait for "Your service is live"** message

4. **Note Your Render URL**:
   ```
   https://techaurex-backend.onrender.com
   ```

## ✅ Step 6: Verify Deployment

### Test Health Endpoint

```bash
curl https://techaurex-backend.onrender.com/api/v1/health
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "uptime": 123.456
  },
  "message": "Server is healthy 🚀",
  "success": true
}
```

### Check Render Logs

In Render dashboard, click **"Logs"** tab and verify:
- ✅ `✅ MongoDB connected: ac-31x9qlp-shard-00-00.6doahm3.mongodb.net`
- ✅ `⚡ Socket.IO server started`
- ✅ `ℹ️ Redis disabled — single-instance mode`
- ✅ `📡 Namespaces initialized`
- ✅ `🚀 Socket.IO ready`
- ✅ `✅ Server running on port XXXX in production mode`
- ✅ No error messages

## 📋 Step 7: Update CLIENT_URL (After Frontend Deployment)

⚠️ **IMPORTANT**: After deploying frontend to Vercel, update this variable:

1. Go to Render dashboard → Your service
2. Click **"Environment"** tab
3. Update `CLIENT_URL`:
   ```env
   CLIENT_URL=https://your-frontend.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will automatically redeploy (1-2 minutes)

## 📋 Step 8: Update OAuth Callback URLs

After noting your Render URL, go back and update OAuth settings (see Step 2).

## 🎯 Testing Your Deployed Backend

### 1. Test Authentication Endpoint

```bash
# Signup
curl -X POST https://techaurex-backend.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 2. Test Socket.IO Connection

Use a Socket.IO client tester or wait for frontend deployment.

### 3. Test CORS

Will be verified once frontend is deployed and connected.

## ⚠️ Important Notes

### Render Free Tier Limitations
- Services **spin down after 15 minutes** of inactivity
- First request after sleep takes **30-60 seconds** (cold start)
- **750 hours/month** free (enough for 1 service)
- Automatic SSL certificates
- Auto-deploy on git push

### Cold Start Workaround
Set up a cron job or uptime monitor to ping your backend every 10 minutes:
- **UptimeRobot** (free): https://uptimerobot.com/
- Ping URL: `https://techaurex-backend.onrender.com/api/v1/health`

### Security Best Practices
- ✅ JWT secrets are unique for production (don't reuse dev secrets)
- ✅ MongoDB allows connections from anywhere (required for Render)
- ✅ CORS configured with dynamic CLIENT_URL
- ✅ All sensitive credentials in environment variables
- ✅ Logger used instead of console.log for production debugging

## 🔧 Troubleshooting

### Build Fails
**Error**: `npm ERR! missing script: start`
- **Fix**: Verify `package.json` has `"start": "node server.js"`

### MongoDB Connection Error
**Error**: `MongoNetworkError: connection timed out`
- **Fix**: Add 0.0.0.0/0 to MongoDB Atlas Network Access

### Module Not Found Error
**Error**: `Cannot find module '@socket.io/redis-adapter'`
- **Fix**: Already added to package.json. Rebuild service.

### CORS Error (After Frontend Deployed)
**Error**: `Access to fetch... blocked by CORS policy`
- **Fix**: Update `CLIENT_URL` to match exact Vercel URL (no trailing slash)

### Service Won't Start
**Error**: `Application failed to respond`
- **Fix**: Check Render logs for specific error
- Verify all required environment variables are set
- Check PORT is set to 4000 or use process.env.PORT

## 📊 Monitoring Your Service

### Render Dashboard Metrics
- Request count
- Response times
- Memory usage
- Bandwidth usage

### Set Up Alerts (Optional)
- Configure email alerts for service down
- Set up custom metrics
- Monitor error rates

## 🎉 Success Checklist

After deployment, you should have:
- ✅ Backend running on Render with public URL
- ✅ Health endpoint responding successfully
- ✅ MongoDB connected (check logs)
- ✅ Socket.IO server running
- ✅ All environment variables configured
- ✅ OAuth apps updated with production callbacks
- ✅ No errors in Render logs

## 🔜 Next Steps

1. **Deploy Frontend to Vercel** (Phase 2)
2. **Update CLIENT_URL** in Render with Vercel URL
3. **Test End-to-End**:
   - Frontend → Backend API calls
   - Socket.IO real-time features
   - Email invitations
   - OAuth login flows
4. **Set Up Uptime Monitoring** (to prevent cold starts)
5. **Configure Custom Domain** (optional)

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com/
- **MongoDB Atlas Support**: https://www.mongodb.com/docs/atlas/
- **Brevo Support**: https://help.brevo.com/

---

**🎊 Congratulations! Your TechAurex backend is ready for production!**

Your backend URL: `https://techaurex-backend.onrender.com`

Proceed to **Phase 2: Frontend Deployment to Vercel**
