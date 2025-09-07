# Railway Deployment Fix

## 🚨 Issue: "Error creating build plan with Railpack"

The deployment failed because Railway's Nixpacks had trouble with the multi-service structure. Here's how to fix it:

## 🔧 Solution 1: Deploy Server Only (Recommended)

### Step 1: Delete the failed service
1. Go to your Railway dashboard
2. Click on the failed "echo-board" service
3. Go to **Settings** → **Delete Service**

### Step 2: Create new services properly

#### Create Server Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `server`
4. Railway will use `server/nixpacks.toml`

#### Create Worker Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `worker`
4. Railway will use `worker/nixpacks.toml`

#### Create Client Service:
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `client`
4. Railway will use `client/nixpacks.toml`

### Step 3: Add Databases
1. **MongoDB**: Click **"+ New"** → **"Database"** → **"MongoDB"**
2. **Redis**: Click **"+ New"** → **"Database"** → **"Redis"**

## 🔧 Solution 2: Single Service Deployment

If the multi-service approach still fails, deploy just the server first:

### Step 1: Create Server Service
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **Set Root Directory**: `server`
4. Add environment variables (see below)

### Step 2: Add Databases
1. **MongoDB**: Click **"+ New"** → **"Database"** → **"MongoDB"**
2. **Redis**: Click **"+ New"** → **"Database"** → **"Redis"**

### Step 3: Set Environment Variables
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

## 🔧 Solution 3: Use Dockerfile (Alternative)

If Nixpacks continues to fail, we can use Docker:

### Step 1: Create Dockerfile in root
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY common/package*.json ./common/
COPY server/package*.json ./server/

# Install dependencies
RUN cd common && npm install
RUN cd server && npm install

# Copy source code
COPY common/ ./common/
COPY server/ ./server/

# Build
RUN cd common && npm run build
RUN cd server && npm run build

# Start
WORKDIR /app/server
CMD ["node", "dist/index.js"]
```

### Step 2: Deploy with Docker
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. Railway will detect the Dockerfile and use it

## 🎯 Recommended Approach

**Start with Solution 1** (multi-service with proper root directories):

1. **Delete the failed service**
2. **Create 3 separate services** with correct root directories
3. **Add MongoDB and Redis databases**
4. **Set environment variables**
5. **Deploy**

## 📋 Environment Variables for Each Service

### Server Service:
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

### Worker Service:
```bash
NODE_ENV=production
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EchoBoard <noreply@resend.dev>
LOG_LEVEL=info
```

### Client Service:
```bash
NODE_ENV=production
VITE_API_URL=https://your-server-service.railway.app
```

## 🚀 After Deployment

Once your server is deployed:
1. **Test the API**: `https://your-server.railway.app/api/health`
2. **Add the worker service**
3. **Add the client service**
4. **Test the full application**

## 🆘 If Still Failing

If you continue to have issues:
1. **Check the build logs** in Railway dashboard
2. **Try the Dockerfile approach**
3. **Contact Railway support**
4. **Consider using Render.com as alternative**

The key is to deploy each service separately with the correct root directory! 🎯
