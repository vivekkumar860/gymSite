# Render.com Debugging Guide

## 1. Access Render Dashboard
- Go to [dashboard.render.com](https://dashboard.render.com)
- Select your service (gymsite-backend)

## 2. View Live Logs
In your Render dashboard:
- Click on your service
- Go to "Logs" tab
- You'll see real-time logs streaming

## 3. Shell Access (For Debugging)
In Render dashboard:
- Click "Shell" tab
- Run commands directly:
```bash
# Check database connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy

# Check environment variables
env | grep -E "DATABASE_URL|NODE_ENV|PORT"

# Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('DB Connected')).catch(console.error)"
```

## 4. Common Debug Commands

### Check Service Health
```bash
curl https://your-service.onrender.com/health
```

### Check API Response
```bash
curl https://your-service.onrender.com/api/exercises
```

### Database Issues
```bash
# In Render Shell
npx prisma studio  # Opens Prisma Studio to view data
npx prisma migrate status  # Check migration status
```

## 5. Monitor Performance
- **Metrics Tab**: CPU, Memory, Network usage
- **Events Tab**: Deploys, restarts, failures
- **Logs Tab**: Application logs, errors

## 6. Debug Locally with Production Data
```bash
# Clone production database locally
DATABASE_URL="your-render-database-url" npx prisma db pull

# Test with production environment
NODE_ENV=production npm run start:dev
```

## 7. Common Issues & Solutions

### Database Connection Timeout
- Add `?connection_limit=1` to DATABASE_URL
- Increase timeout: `?connect_timeout=300`

### Build Failures
```bash
# Check build logs
npm run build

# Verify Prisma generation
npx prisma generate
```

### CORS Issues
- Verify CORS_ORIGIN in environment variables
- Should match your frontend URL exactly

### Service Sleeping (Free Tier)
- Free services sleep after 15 minutes
- First request takes 30-60 seconds to wake
- Solution: Upgrade to paid tier or use a health check service

## 8. Monitoring Tools

### External Monitoring
- [UptimeRobot](https://uptimerobot.com) - Free monitoring
- [Pingdom](https://www.pingdom.com) - Advanced monitoring

### Health Check Script
Create a monitoring endpoint:
```typescript
// In your backend
@Get('health')
async checkHealth() {
  const db = await this.prisma.$queryRaw`SELECT 1`;
  return {
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  };
}
```

## 9. CLI Access (Alternative to Dashboard)

Install Render CLI:
```bash
# macOS
brew tap render-oss/render
brew install render

# Login
render login

# List services
render services list

# View logs
render logs tail --service gymsite-backend

# SSH into service
render shell --service gymsite-backend
```

## 10. Debug Checklist

- [ ] Check deployment logs for errors
- [ ] Verify all environment variables are set
- [ ] Test database connection
- [ ] Check CORS configuration
- [ ] Verify build command succeeded
- [ ] Test API endpoints with curl
- [ ] Monitor memory/CPU usage
- [ ] Check for rate limiting issues