# Resend Email Setup Guide

## 🔑 Getting Your Resend API Key

### 1. Sign Up for Resend
- Visit [resend.com](https://resend.com)
- Click "Sign Up" and create an account
- Verify your email address

### 2. Get Your API Key
1. Log into your Resend dashboard
2. Navigate to "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a descriptive name (e.g., "EchoBoard Production")
5. Copy the generated API key (starts with `re_`)

### 3. Domain Setup (For Production)

#### Option A: Use Resend's Test Domain (Quick Start)
- **From Email**: `EchoBoard <noreply@resend.dev>`
- **No setup required** - works immediately
- **Limitation**: Only for testing/development

#### Option B: Use Your Own Domain (Production)
1. **Add Domain in Resend**:
   - Go to "Domains" in Resend dashboard
   - Click "Add Domain"
   - Enter your domain (e.g., `echoboard.com`)

2. **Verify Domain**:
   - Add the provided DNS records to your domain
   - Wait for verification (usually 5-10 minutes)

3. **Update Configuration**:
   - **From Email**: `EchoBoard <noreply@yourdomain.com>`
   - **Environment Variable**: `FROM_EMAIL=EchoBoard <noreply@yourdomain.com>`

## ⚙️ Configuration

### Environment Variables
```bash
# Required
RESEND_API_KEY=re_your_actual_api_key_here

# Optional (defaults to resend.dev for testing)
FROM_EMAIL=EchoBoard <noreply@yourdomain.com>
```

### Kubernetes Deployment
Update your deployment files:

```yaml
env:
  - name: RESEND_API_KEY
    value: 're_your_actual_api_key_here'
  - name: FROM_EMAIL
    value: 'EchoBoard <noreply@yourdomain.com>'
```

### Local Development
Create a `.env` file in your project root:

```bash
# .env
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=EchoBoard <noreply@resend.dev>
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🧪 Testing

### Test Email Sending
1. **Start the worker**:
   ```bash
   cd worker
   npm run dev
   ```

2. **Add a test job**:
   ```bash
   node test-worker.js
   ```

3. **Check the logs** for email sending status

### Test with Real Feedback
1. **Start all services** (server, worker, Redis)
2. **Create a user account** (triggers welcome email)
3. **Submit feedback** (triggers feedback confirmation email)
4. **Check your email** for the notifications

## 📧 Email Templates

The worker sends these email types:

1. **Welcome Email** - When user signs up
2. **Feedback Confirmation** - When feedback is created
3. **Feedback Update** - When admin updates feedback

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Check your API key is correct
   - Ensure no extra spaces or characters

2. **"Domain not verified"**
   - Use `noreply@resend.dev` for testing
   - Or verify your domain in Resend dashboard

3. **"Rate limit exceeded"**
   - Resend has rate limits on free tier
   - Consider upgrading for production use

4. **Emails not sending**
   - Check worker logs for errors
   - Verify Redis connection
   - Ensure worker is running

### Debug Mode
Set `LOG_LEVEL=debug` for detailed logging:

```bash
LOG_LEVEL=debug npm run dev
```

## 💰 Pricing

- **Free Tier**: 3,000 emails/month
- **Pro Tier**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

## 🔒 Security

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Rotate API keys** regularly
- **Use different keys** for development/production

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [Email Templates](https://resend.com/docs/send-with-nodejs)
- [Domain Setup](https://resend.com/docs/domains/introduction)






