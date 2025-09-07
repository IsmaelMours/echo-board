# Railway Deployment Setup Guide

## 🚀 Perfect! Railway Detected Your Project

Railway's Nixpacks has analyzed your EchoBoard project and detected:
- ✅ **Node.js** application
- ✅ **Multi-service** architecture (client, server, worker, common)
- ✅ **TypeScript** support
- ✅ **Package.json** files in each directory

## 📋 Railway Deployment Steps

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. **Sign up with GitHub** (recommended)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your EchoBoard repository

### Step 2: Add Database Services

#### Add MongoDB:
1. Click **"+ New"** → **"Database"** → **"MongoDB"**
2. Railway creates MongoDB instance automatically
3. Note the connection details (you'll need them for environment variables)

#### Add Redis:
1. Click **"+ New"** → **"Database"** → **"Redis"**
2. Railway creates Redis instance automatically
3. Note the connection details

### Step 3: Add Application Services

#### Add Server Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `server`
4. Railway will use the `server/nixpacks.toml` configuration

#### Add Worker Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `worker`
4. Railway will use the `worker/nixpacks.toml` configuration

#### Add Client Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `client`
4. Railway will use the `client/nixpacks.toml` configuration

### Step 4: Configure Environment Variables

#### Server Service Variables:
```bash
NODE_ENV=production
PORT=3000
JWT_KEY=your-super-secret-jwt-key-here
MONGO_URI=${{MongoDB.MONGO_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EchoBoard <noreply@resend.dev>
```

#### Worker Service Variables:
```bash
NODE_ENV=production
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EchoBoard <noreply@resend.dev>
LOG_LEVEL=info
```

#### Client Service Variables:
```bash
NODE_ENV=production
VITE_API_URL=https://your-server-service.railway.app
```

### Step 5: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. **Sign up for free** (3,000 emails/month)
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_`)
5. Add it to your environment variables

### Step 6: Deploy

1. Railway will automatically start building using Nixpacks
2. Wait for all services to show **"Deployed"** status
3. Click on your **server service** to get the URL
4. Your app will be available at: `https://your-server-service.railway.app`

## 🔧 Nixpacks Configuration

I've created `nixpacks.toml` files for each service:

### Root `nixpacks.toml`:
- Builds all services
- Starts with server by default

### `server/nixpacks.toml`:
- Builds common package first
- Builds server
- Starts with `node dist/index.js`

### `worker/nixpacks.toml`:
- Builds common package first
- Builds worker
- Starts with `node dist/index.js`

### `client/nixpacks.toml`:
- Builds React app
- Serves static files with `serve`

## 🎯 Railway Free Tier

- **$5 credit monthly** (usually enough for small apps)
- **500 hours of usage** per month
- **Automatic scaling** based on traffic
- **Custom domains** supported
- **SSL certificates** included

## 🚀 Your App is Live!

Once deployed, you'll have:
- ✅ **Public API** with full CRUD operations
- ✅ **User Dashboard** for feedback submission
- ✅ **Admin Dashboard** for feedback management
- ✅ **Authentication** with JWT
- ✅ **Background Jobs** for email processing
- ✅ **Rate Limiting** and input validation
- ✅ **Health Checks** and monitoring
- ✅ **Transactional Emails** via Resend

## 📱 Test Your Deployment

1. **Health Check**: `https://your-server-service.railway.app/api/health`
2. **Frontend**: `https://your-server-service.railway.app`
3. **Create Account**: Test user registration
4. **Submit Feedback**: Test the feedback system

## 🎉 Success!

Your EchoBoard application is now live and ready to collect feedback! Share the URL with users and start gathering valuable insights.

**Live URL**: `https://your-server-service.railway.app`

All for **FREE** using Railway! 🚀
