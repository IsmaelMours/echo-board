# Railway Environment Variables Setup

## 🎉 Great News: Build is Working!

The Railway deployment is now working successfully! The application is starting but needs environment variables to be configured.

## 🔧 Required Environment Variables

Based on the server code, you need to set these environment variables in Railway:

### **Required Variables:**

1. **`JWT_KEY`** - Secret key for JWT token signing
2. **`MONGO_URI`** - MongoDB connection string
3. **`COOKIE_SECRET`** - Secret for cookie session (optional, defaults to 'secret')
4. **`REDIS_HOST`** - Redis server host (optional, defaults to 'localhost')
5. **`REDIS_PORT`** - Redis server port (optional, defaults to '6379')
6. **`REDIS_PASSWORD`** - Redis password (optional)

### **Optional Variables:**
- **`PORT`** - Server port (Railway sets this automatically)
- **`NODE_ENV`** - Environment (Railway sets this to 'production')

## 🚀 How to Set Environment Variables in Railway

### **Method 1: Railway Dashboard**
1. Go to your Railway project dashboard
2. Click on your service
3. Go to the **"Variables"** tab
4. Add each environment variable:
   - Click **"New Variable"**
   - Enter the variable name (e.g., `JWT_KEY`)
   - Enter the variable value
   - Click **"Add"**

### **Method 2: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Set environment variables
railway variables set JWT_KEY="your-jwt-secret-here"
railway variables set MONGO_URI="mongodb://your-mongo-connection-string"
railway variables set COOKIE_SECRET="your-cookie-secret"
railway variables set REDIS_HOST="your-redis-host"
railway variables set REDIS_PORT="6379"
railway variables set REDIS_PASSWORD="your-redis-password"
```

## 🔑 Environment Variable Values

### **JWT_KEY**
Generate a secure random string:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 32

# Option 3: Use online generator
# Visit: https://generate-secret.vercel.app/32
```

### **MONGO_URI**
For development/testing, you can use:
- **MongoDB Atlas** (free tier): `mongodb+srv://username:password@cluster.mongodb.net/echoboard`
- **Railway MongoDB** (if available): Check Railway's database services
- **Local MongoDB** (for testing): `mongodb://localhost:27017/echoboard`

### **COOKIE_SECRET**
Generate a secure random string (same as JWT_KEY):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Redis Configuration**
If you're using Redis (for background jobs):
- **Railway Redis** (if available): Check Railway's database services
- **Redis Cloud** (free tier): Get connection details from Redis Cloud
- **Local Redis** (for testing): Use default values

## 📋 Quick Setup Example

Here's a complete example of environment variables you can set:

```bash
# JWT Secret (generate your own!)
JWT_KEY=your-super-secret-jwt-key-here-32-chars-minimum

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/echoboard

# Cookie Secret
COOKIE_SECRET=your-super-secret-cookie-key-here

# Redis (if using background jobs)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

## 🔄 After Setting Variables

1. **Redeploy** your Railway service (it should happen automatically)
2. **Check the logs** to see if the application starts successfully
3. **Test the endpoints** to make sure everything works

## 🎯 Expected Success Logs

After setting the environment variables, you should see:
```
Attempting to connect to MongoDB...
Connected to MongoDB successfully!
Server starting...
Server listening on port 3000
```

## 🚨 Common Issues

### **MongoDB Connection Issues:**
- Check if the MongoDB URI is correct
- Ensure the database is accessible from Railway
- Verify username/password are correct

### **JWT Key Issues:**
- Make sure JWT_KEY is at least 32 characters long
- Use a secure random string
- Don't use common passwords

### **Redis Issues:**
- If you're not using background jobs, you can leave Redis variables empty
- The application will work without Redis (just no background jobs)

## 🎉 Next Steps

1. **Set the environment variables** in Railway
2. **Redeploy** the service
3. **Test** the application endpoints
4. **Share** your live URL!

Your EchoBoard application should now be fully deployed and working! 🚀
