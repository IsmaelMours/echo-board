# Client (Frontend) Deployment Guide

## 🎯 **Deployment Options**

### **Option 1: Vercel (Recommended - Free)**
Perfect for React applications with excellent free tier.

### **Option 2: Railway (Same Platform)**
Deploy as a separate service on Railway.

### **Option 3: Netlify (Free)**
Another great option for static React apps.

## 🚀 **Option 1: Deploy to Vercel**

### **Step 1: Prepare for Vercel**

1. **Go to Vercel**: https://vercel.com/
2. **Sign up** with GitHub (recommended)
3. **Import your repository**
4. **Set build settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### **Step 2: Configure Environment Variables**

In Vercel dashboard, add environment variable:
```
VITE_API_URL=https://your-railway-app-url.railway.app
```

Replace `your-railway-app-url` with your actual Railway URL.

### **Step 3: Deploy**

1. **Click "Deploy"**
2. **Wait for build** to complete
3. **Get your Vercel URL** (something like `https://echo-board.vercel.app`)

## 🚀 **Option 2: Deploy to Railway**

### **Step 1: Create New Service**

1. **Go to Railway dashboard**
2. **Click "+ New"** → **"GitHub Repo"**
3. **Select your repository**
4. **Set Root Directory** to `client`

### **Step 2: Configure Build**

Railway will auto-detect Vite, but you can add a `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npx serve -s dist -l 8080"

[variables]
NODE_ENV = "production"
VITE_API_URL = "https://your-railway-app-url.railway.app"
```

### **Step 3: Deploy**

1. **Add environment variables**
2. **Deploy the service**
3. **Get your Railway client URL**

## 🚀 **Option 3: Deploy to Netlify**

### **Step 1: Prepare for Netlify**

1. **Go to Netlify**: https://netlify.com/
2. **Sign up** with GitHub
3. **Import your repository**

### **Step 2: Configure Build Settings**

- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `client/dist`

### **Step 3: Add Environment Variables**

In Netlify dashboard:
```
VITE_API_URL=https://your-railway-app-url.railway.app
```

## 🔧 **Update API Configuration**

After deploying, you need to update the client to use your server URL:

### **Method 1: Environment Variable**
The client is already configured to use `VITE_API_URL` if set.

### **Method 2: Update API Base URL**
If needed, update `client/src/lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Use environment variable
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 📋 **Complete Setup**

### **Your URLs will be:**
- **Backend (API)**: `https://echo-board-production.railway.app`
- **Frontend (Client)**: `https://echo-board.vercel.app` (or your chosen platform)

### **Environment Variables for Client:**
```
VITE_API_URL=https://echo-board-production.railway.app
```

## 🎉 **Expected Result**

After deployment:
- ✅ **Frontend accessible** via your chosen platform URL
- ✅ **API calls** go to your Railway backend
- ✅ **Full functionality** working end-to-end
- ✅ **Authentication** working between frontend and backend

## 💡 **Recommendation**

**Vercel** is the best choice because:
- ✅ **Free tier** with excellent limits
- ✅ **Automatic deployments** from GitHub
- ✅ **Perfect for React/Vite** applications
- ✅ **Fast global CDN**
- ✅ **Easy environment variable management**

Choose Vercel for the best experience! 🚀
