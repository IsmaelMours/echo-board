# EchoBoard Free Deployment Options

This directory contains deployment configurations for various free hosting platforms. Choose the option that best fits your needs.

## 🚀 Free Deployment Platforms

### 1. **Railway** (Recommended)
**Free Tier**: $5 credit monthly, 500 hours of usage
**Best for**: Full-stack applications with databases

#### Setup Steps:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project
4. Add services:
   - **Server**: Connect your GitHub repo, use `server/` directory
   - **Worker**: Connect your GitHub repo, use `worker/` directory  
   - **Client**: Connect your GitHub repo, use `client/` directory
   - **MongoDB**: Add MongoDB service
   - **Redis**: Add Redis service

#### Environment Variables:
```bash
# Server
NODE_ENV=production
PORT=3000
JWT_KEY=your-super-secret-jwt-key
MONGO_URI=mongodb://mongo:27017/echoboard
REDIS_HOST=redis
REDIS_PORT=6379
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=EchoBoard <noreply@resend.dev>

# Worker
NODE_ENV=production
REDIS_HOST=redis
REDIS_PORT=6379
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=EchoBoard <noreply@resend.dev>
LOG_LEVEL=info
```

### 2. **Render**
**Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
**Best for**: Simple deployments with automatic scaling

#### Setup Steps:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new services using `render.yaml`:
   - **Web Service**: For server
   - **Background Worker**: For worker
   - **Static Site**: For client
   - **MongoDB**: Database
   - **Redis**: Cache

#### Deploy Command:
```bash
# Connect your GitHub repo and Render will auto-deploy
```

### 3. **Vercel** (Frontend Only)
**Free Tier**: Unlimited static sites, 100GB bandwidth
**Best for**: Frontend deployment only

#### Setup Steps:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. **Heroku** (Limited Free Tier)
**Free Tier**: Discontinued, but you can use the paid plans
**Best for**: Traditional web apps

#### Setup Steps:
1. Install Heroku CLI
2. Create Heroku apps:
```bash
# Server
heroku create echoboard-server
heroku buildpacks:set heroku/nodejs -a echoboard-server

# Worker  
heroku create echoboard-worker
heroku buildpacks:set heroku/nodejs -a echoboard-worker
```

## 🎯 Recommended Free Setup

### Option 1: Railway (Full Stack)
- **Server**: Railway web service
- **Worker**: Railway background service
- **Client**: Railway static site
- **Database**: Railway MongoDB
- **Cache**: Railway Redis

### Option 2: Render + Vercel
- **Server**: Render web service
- **Worker**: Render background worker
- **Client**: Vercel static site
- **Database**: Render MongoDB
- **Cache**: Render Redis

## 📋 Environment Variables Setup

### Required Variables:
```bash
# Application
NODE_ENV=production
JWT_KEY=your-super-secret-jwt-key-here

# Database
MONGO_URI=mongodb://username:password@host:port/database

# Cache/Queue
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=EchoBoard <noreply@resend.dev>
```

### Getting Resend API Key:
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Create API key
4. Use `noreply@resend.dev` for testing

## 🚀 Quick Start with Railway

1. **Fork this repository**
2. **Go to [railway.app](https://railway.app)**
3. **Sign up with GitHub**
4. **Create new project**
5. **Add services:**
   - MongoDB
   - Redis
   - GitHub repo (server)
   - GitHub repo (worker)
   - GitHub repo (client)
6. **Set environment variables**
7. **Deploy!**

## 🔧 Local Development

```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ../worker && npm install
cd ../common && npm install

# Start services
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis
redis-server

# Terminal 3: Server
cd server && npm run dev

# Terminal 4: Worker
cd worker && npm run dev

# Terminal 5: Client
cd client && npm run dev
```

## 📊 Monitoring

### Health Checks:
- **API Health**: `https://your-app.railway.app/api/health`
- **Frontend**: `https://your-app.railway.app`

### Logs:
- Railway: Built-in logging dashboard
- Render: Service logs in dashboard
- Vercel: Function logs in dashboard

## 💡 Tips for Free Deployment

1. **Optimize Images**: Use WebP format, compress images
2. **Enable Caching**: Set proper cache headers
3. **Monitor Usage**: Check platform usage limits
4. **Use CDN**: Vercel/Railway provide global CDN
5. **Database Optimization**: Use indexes, limit queries
6. **Error Handling**: Implement proper error boundaries

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection**:
   - Verify connection string format
   - Check if database service is running
   - Ensure proper network access

3. **Environment Variables**:
   - Double-check variable names
   - Ensure all required variables are set
   - Check for typos in values

4. **CORS Issues**:
   - Update CORS settings for production domain
   - Check API endpoint URLs

### Getting Help:
- Check platform documentation
- Review build logs
- Test locally first
- Use platform support channels

## 🎉 Success!

Once deployed, your EchoBoard application will be available at:
- **Frontend**: `https://your-app.railway.app`
- **API**: `https://your-app.railway.app/api`
- **Health Check**: `https://your-app.railway.app/api/health`

Share your live URL and start collecting feedback! 🚀
