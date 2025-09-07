# Railway Deployment Guide

## 🚀 Quick Deploy to Railway (FREE)

Railway offers a generous free tier perfect for your EchoBoard application!

### Step 1: Prepare Your Repository

1. **Fork this repository** to your GitHub account
2. **Make sure all files are committed** and pushed to GitHub

### Step 2: Set Up Railway

1. Go to [railway.app](https://railway.app)
2. **Sign up with GitHub** (recommended)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your forked EchoBoard repository

### Step 3: Add Services

Railway will automatically detect your project structure. You need to add these services:

#### 3.1 Add MongoDB Database
1. Click **"+ New"** → **"Database"** → **"MongoDB"**
2. Railway will create a MongoDB instance
3. Note the connection details

#### 3.2 Add Redis Cache
1. Click **"+ New"** → **"Database"** → **"Redis"**
2. Railway will create a Redis instance
3. Note the connection details

#### 3.3 Add Server Service
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. Set **Root Directory** to `server`
4. Railway will auto-detect it's a Node.js app

#### 3.4 Add Worker Service
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. Set **Root Directory** to `worker`
4. Railway will auto-detect it's a Node.js app

#### 3.5 Add Client Service
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. Set **Root Directory** to `client`
4. Railway will auto-detect it's a Node.js app

### Step 4: Configure Environment Variables

For each service, go to **Settings** → **Variables** and add:

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

1. Railway will automatically start building and deploying
2. Wait for all services to show **"Deployed"** status
3. Click on your **server service** to get the URL
4. Your app will be available at: `https://your-server-service.railway.app`

### Step 7: Test Your Deployment

1. **Health Check**: Visit `https://your-server-service.railway.app/api/health`
2. **Frontend**: Visit `https://your-server-service.railway.app`
3. **Create Account**: Test user registration
4. **Submit Feedback**: Test the feedback system

## 🎯 Railway Free Tier Limits

- **$5 credit monthly** (usually enough for small apps)
- **500 hours of usage** per month
- **Automatic scaling** based on traffic
- **Custom domains** supported
- **SSL certificates** included

## 🔧 Troubleshooting

### Build Failures:
1. Check **Deploy Logs** in Railway dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### Database Connection Issues:
1. Check MongoDB connection string format
2. Ensure Redis service is running
3. Verify environment variables are set correctly

### CORS Issues:
1. Update CORS settings in your server
2. Check if frontend URL is correct
3. Verify API endpoint URLs

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

## 📱 Share Your App

Your EchoBoard application is now live and ready to collect feedback! Share the URL with users and start gathering valuable insights.

**Live URL**: `https://your-server-service.railway.app`

## 🎉 Success!

You've successfully deployed a full-stack application with:
- React frontend
- Express.js API
- MongoDB database
- Redis cache/queue
- Background job processing
- Email notifications
- Authentication system
- Admin dashboard

All for **FREE** using Railway! 🚀
