# Railway Quick Fix - Deploy Server Only

## 🚨 Current Issue
Railway can't determine how to build your multi-service app from the root directory.

## 🎯 Quick Solution: Deploy Server Only

### Step 1: Delete Failed Service
1. Go to Railway dashboard
2. Delete the failed "successful-imagination" service

### Step 2: Create New Service with Root Directory
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your EchoBoard repository
3. **IMPORTANT**: Set **Root Directory** to `server`
4. This tells Railway to only build the server part

### Step 3: Add Databases
1. **MongoDB**: Click **"+ New"** → **"Database"** → **"MongoDB"**
2. **Redis**: Click **"+ New"** → **"Database"** → **"Redis"**

### Step 4: Set Environment Variables
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

### Step 5: Deploy
Railway will now:
1. Use `server/nixpacks.toml` configuration
2. Build the common package first
3. Build the server
4. Start with `node dist/index.js`

## 🎯 Why This Works

- **Root Directory = `server`**: Railway only looks at the server folder
- **server/nixpacks.toml**: Proper build configuration for server
- **Dependencies**: Builds common package first, then server
- **Start Command**: Simple `node dist/index.js`

## 🚀 After Server is Working

Once your server is deployed and working:

1. **Test API**: `https://your-server.railway.app/api/health`
2. **Add Worker Service**: Root directory = `worker`
3. **Add Client Service**: Root directory = `client`

## 📋 Environment Variables for Each Service

### Server (Main API):
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

### Worker (Background Jobs):
```bash
NODE_ENV=production
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EchoBoard <noreply@resend.dev>
LOG_LEVEL=info
```

### Client (Frontend):
```bash
NODE_ENV=production
VITE_API_URL=https://your-server.railway.app
```

## 🎉 Success!

This approach will work because:
- ✅ **Single service** deployment (easier for Railway)
- ✅ **Proper root directory** (server folder only)
- ✅ **Correct build config** (server/nixpacks.toml)
- ✅ **Simple start command** (node dist/index.js)

Your EchoBoard API will be live and ready to collect feedback! 🚀
