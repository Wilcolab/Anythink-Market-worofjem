# Deployment Guide - Node.js Server

## Overview

This guide covers deploying your Node.js server to various hosting platforms, from development to production environments.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [x] All tests passing: `npm test` (65/65 ✅)
- [x] Environment variables configured
- [x] Dependencies installed: `npm install`
- [x] No hardcoded secrets
- [x] Error handling in place
- [x] Logging enabled
- [x] Health check endpoint available: `/health`
- [x] Metrics endpoint available: `/metrics`

---

## 🚀 Deployment Options

### Option 1: Heroku (Easiest for Beginners)

#### Step 1: Prepare for Heroku

**Create a `.env` file** (not committed):
```env
PORT=8001
NODE_ENV=production
```

**Ensure `package.json` has proper scripts**:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --coverage"
  }
}
```

**Create a `Procfile`** in root directory:
```
web: npm start
```

#### Step 2: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Deploy from git
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

#### Step 3: Verify Deployment

```bash
# Check health
curl https://your-app-name.herokuapp.com/health

# Get metrics
curl https://your-app-name.herokuapp.com/metrics

# Test endpoint
curl https://your-app-name.herokuapp.com/tasks
```

#### Step 4: Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=8001

# Verify
heroku config
```

---

### Option 2: AWS (More Control)

#### Using AWS Elastic Beanstalk

**Step 1: Prepare Application**

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-18 my-app --region us-east-1
```

**Create `.ebignore`**:
```
node_modules/
.git/
coverage/
.env
*.log
```

**Step 2: Deploy**

```bash
# Create environment and deploy
eb create my-app-env

# Deploy updates
eb deploy

# View logs
eb logs

# Open app
eb open
```

**Step 3: Configure**

```bash
# Set environment variables
eb setenv NODE_ENV=production PORT=8001

# Check health
eb health

# Scale instances
eb scale 2
```

#### Using AWS EC2

**Step 1: Launch EC2 Instance**

- AMI: Amazon Linux 2 or Ubuntu 20.04
- Instance type: t2.micro (free tier eligible)
- Security groups: Allow HTTP (80), HTTPS (443), SSH (22)

**Step 2: Install Node.js**

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

**Step 3: Deploy Application**

```bash
# Clone repository
git clone https://github.com/your-repo/your-project.git
cd your-project/node-server

# Install dependencies
npm install

# Start application
npm start
```

**Step 4: Use PM2 for Process Management**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start src/index.js --name "node-server"

# Configure to start on reboot
pm2 startup
pm2 save

# View logs
pm2 logs node-server

# Monitor
pm2 monit
```

---

### Option 3: Docker & Containerization

#### Step 1: Build Docker Image

**Update `Dockerfile`**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "src/index.js"]
```

#### Step 2: Build and Run Locally

```bash
# Build image
docker build -t my-node-server:1.0.0 .

# Run container
docker run -p 8001:8001 \
  -e NODE_ENV=production \
  -e PORT=8001 \
  my-node-server:1.0.0

# Test
curl http://localhost:8001/health
```

#### Step 3: Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag my-node-server:1.0.0 username/my-node-server:1.0.0

# Push
docker push username/my-node-server:1.0.0
```

#### Step 4: Deploy to Docker Swarm or Kubernetes

**Docker Swarm**:
```bash
docker service create \
  --name node-server \
  --publish 8001:8001 \
  -e NODE_ENV=production \
  username/my-node-server:1.0.0
```

**Kubernetes**:
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-server
  template:
    metadata:
      labels:
        app: node-server
    spec:
      containers:
      - name: node-server
        image: username/my-node-server:1.0.0
        ports:
        - containerPort: 8001
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 10
          periodSeconds: 30
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl logs deployment/node-server
```

---

### Option 4: Vercel (Serverless)

#### Step 1: Create `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "node-server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "node-server/src/index.js"
    }
  ]
}
```

#### Step 2: Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

---

### Option 5: DigitalOcean App Platform

#### Step 1: Connect Repository

1. Go to DigitalOcean dashboard
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Select repository and branch

#### Step 2: Configure

```yaml
# app.yaml (auto-generated, edit if needed)
name: node-server
services:
- name: node-server
  github:
    repo: your-username/your-repo
    branch: main
  source_dir: node-server
  build_command: npm install
  run_command: npm start
  http_port: 8001
  envs:
  - key: NODE_ENV
    value: production
```

#### Step 3: Deploy

- Review configuration
- Click "Create Resources"
- Wait for deployment
- Access via provided domain

---

## 🔒 Security Configuration

### Environment Variables for Production

**Create `.env.production`**:
```env
NODE_ENV=production
PORT=8001
LOG_LEVEL=info
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### HTTPS/SSL Configuration

**Using Let's Encrypt**:
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificate locations:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

**Update Node.js app**:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server running on port 443');
});
```

### Rate Limiting Configuration for Production

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // limit each IP to 100 requests
  message: 'Too many requests',
  standardHeaders: true,      // Return rate limit info in headers
  legacyHeaders: false,       // Disable X-RateLimit-* headers
  skip: () => process.env.NODE_ENV === 'test'
});
```

---

## 📊 Monitoring & Logging

### Application Performance Monitoring (APM)

**Using New Relic**:

```bash
npm install newrelic
```

**Add to top of `src/index.js`**:
```javascript
require('newrelic');
// ... rest of code
```

**Configure `newrelic.js`**:
```javascript
exports.config = {
  app_name: ['Node Server'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  }
};
```

### Logging

**Using Winston**:

```bash
npm install winston
```

**Setup**:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**Create `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: cd node-server && npm install
    - run: cd node-server && npm test
    - run: cd node-server && npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        HEROKU_APP_NAME: ${{ secrets.HEROKU_APP_NAME }}
      run: |
        git remote add heroku https://git.heroku.com/$HEROKU_APP_NAME.git
        git push heroku main
```

---

## 📈 Post-Deployment

### Health Checks

```bash
# Monitor health endpoint
watch -n 5 'curl http://your-app/health'

# Monitor metrics
curl http://your-app/metrics | jq '.cacheInfo.hitRate'
```

### Logs

```bash
# View application logs
# Heroku
heroku logs --tail

# AWS EB
eb logs --stream

# EC2/PM2
pm2 logs

# Docker
docker logs container-id
```

### Scaling

**Heroku**:
```bash
heroku ps:scale web=2
```

**AWS EB**:
```bash
eb scale 2
```

**Kubernetes**:
```bash
kubectl scale deployment node-server --replicas=3
```

---

## 🚨 Troubleshooting Deployment Issues

### App Won't Start

```bash
# Check if port is available
lsof -i :8001

# Check environment variables
echo $NODE_ENV
echo $PORT

# Check logs
tail -f app.log
```

### High Memory Usage

```bash
# Monitor memory
top -p $(pgrep -f "node src/index.js")

# Check for memory leaks
node --inspect src/index.js
# Open chrome://inspect in Chrome
```

### Rate Limiting Issues

```bash
# Check if hitting rate limit
for i in {1..101}; do curl http://localhost:8001/tasks; done

# Adjust rate limit in production config
```

---

## ✅ Deployment Verification Checklist

After deployment:

- [ ] Health endpoint returns 200: `curl /health`
- [ ] Metrics endpoint accessible: `curl /metrics`
- [ ] All endpoints respond: `curl /tasks`
- [ ] Can add task: `curl -X POST /tasks -d '{"text":"test"}'`
- [ ] HTTPS enabled (if applicable)
- [ ] Logs are being collected
- [ ] Monitoring is active
- [ ] Rate limiting is working
- [ ] Cache is functioning
- [ ] Error handling is catching errors

---

## 📞 Platform-Specific Support

| Platform | Docs | Support |
|----------|------|---------|
| Heroku | https://devcenter.heroku.com/ | support@heroku.com |
| AWS | https://aws.amazon.com/documentation/ | aws.amazon.com/support |
| DigitalOcean | https://docs.digitalocean.com/ | support.digitalocean.com |
| Vercel | https://vercel.com/docs | support.vercel.com |
| Kubernetes | https://kubernetes.io/docs/ | kubernetes.io |

---

**Status**: ✅ Ready for Production Deployment

**Last Updated**: January 15, 2026
