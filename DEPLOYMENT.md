# GitHub Actions & Cloud Deployment Guide

This project includes three GitHub Actions workflows for automated testing, building, and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers**: Push to main/Solomon, Pull Requests

Runs on every push and PR:
- ✅ Tests Node.js Express server with Jest (31 tests)
- ✅ Tests Python FastAPI server with flake8 linting
- ✅ Builds Docker images for both servers
- ✅ Validates Docker Compose configuration
- ✅ Uploads coverage reports to Codecov

**Status Badge**:
```markdown
![CI Pipeline](https://github.com/Wilcolab/Anythink-Market-worofjem/actions/workflows/ci.yml/badge.svg)
```

### 2. Docker Hub Deployment (`deploy.yml`)
**Triggers**: Push to main branch only

Builds and pushes Docker images to Docker Hub:
- Requires: `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Tags images with: branch name, semantic version (v*), and commit SHA
- Caches layers for faster builds
- Both servers pushed to separate repositories

**Setup**:
```bash
# Set repository secrets in GitHub
1. Go to Settings → Secrets and variables → Actions
2. Add DOCKER_USERNAME
3. Add DOCKER_PASSWORD (Docker Hub token)
```

**Image locations after deploy**:
```
docker pull username/anythink-python-server:main
docker pull username/anythink-node-server:main
docker pull username/anythink-python-server:v1.0.0  # tagged releases
```

### 3. AWS ECS Deployment (`deploy-ecs.yml`)
**Triggers**: Push to main branch (manual workflow dispatch available)

Deploys to AWS Elastic Container Service (Fargate):
- Pushes images to Amazon ECR
- Updates ECS task definitions
- Deploys to ECS service
- Automatic rolling updates with health checks

**Setup**:
```bash
# 1. Set AWS secrets in GitHub Settings → Secrets and variables → Actions
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION (optional, defaults to us-east-1)

# 2. Create ECS resources (one-time setup)
   - ECS Cluster: anythink-market-cluster
   - ECS Service: anythink-market-service
   - ECR Repositories: anythink-python-server, anythink-node-server

# 3. Create task definition file: .aws/python-task-definition.json
   (See example below)
```

## Deployment Options

### Option A: Docker Hub + Manual Deployment

1. **Push to main** → Docker images auto-build and push to Docker Hub
2. **Deploy anywhere** with Docker Compose:

```bash
# On your server with docker-compose installed
docker-compose pull
docker-compose up -d
```

Or pull specific versions:
```bash
export PYTHON_IMAGE=username/anythink-python-server:v1.0.0
export NODE_IMAGE=username/anythink-node-server:v1.0.0
docker-compose up -d
```

### Option B: AWS ECS (Recommended for Production)

1. **Configure AWS** resources and GitHub secrets
2. **Push to main** → Automatically builds, pushes to ECR, and deploys to ECS
3. **Monitor** deployment in AWS ECS console

```bash
# View deployment status
aws ecs describe-services \
  --cluster anythink-market-cluster \
  --services anythink-market-service
```

### Option C: Google Cloud Run

Manual deployment (add similar workflow):

```bash
gcloud run deploy anythink-python --image gcr.io/PROJECT_ID/anythink-python-server
gcloud run deploy anythink-node --image gcr.io/PROJECT_ID/anythink-node-server
```

### Option D: DigitalOcean App Platform

1. Connect GitHub repository
2. Create app spec:

```yaml
name: anythink-market
services:
  - name: python-server
    github:
      repo: Wilcolab/Anythink-Market-worofjem
      branch: main
    dockerfile_path: python-server/Dockerfile
    http_port: 8000
    
  - name: node-server
    github:
      repo: Wilcolab/Anythink-Market-worofjem
      branch: main
    dockerfile_path: node-server/Dockerfile
    http_port: 8001
```

3. Push to main → DigitalOcean auto-deploys

## AWS ECS Setup (Step-by-Step)

### Create ECR Repositories

```bash
# Python server
aws ecr create-repository --repository-name anythink-python-server --region us-east-1

# Node.js server
aws ecr create-repository --repository-name anythink-node-server --region us-east-1
```

### Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name anythink-market-cluster --region us-east-1
```

### Create Task Definition

Create `.aws/python-task-definition.json`:

```json
{
  "family": "anythink-market-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "anythink-python-server",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/anythink-python-server:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/anythink-market",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "python-server"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/tasks || exit 1"],
        "interval": 10,
        "timeout": 5,
        "retries": 5
      }
    },
    {
      "name": "anythink-node-server",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/anythink-node-server:latest",
      "portMappings": [
        {
          "containerPort": 8001,
          "hostPort": 8001,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/anythink-market",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "node-server"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8001/ || exit 1"],
        "interval": 10,
        "timeout": 5,
        "retries": 5
      }
    }
  ]
}
```

### Create ECS Service

```bash
aws ecs create-service \
  --cluster anythink-market-cluster \
  --service-name anythink-market-service \
  --task-definition anythink-market-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "[{\"targetGroupArn\":\"arn:aws:elasticloadbalancing:...\",\"containerName\":\"anythink-python-server\",\"containerPort\":8000}]"
```

## Workflow Status

Check GitHub Actions results:
1. Go to repository → Actions tab
2. View logs for each workflow run
3. Review coverage reports in Codecov

## Secrets Management

All secrets should be stored in GitHub Settings → Secrets and variables:

| Secret | Purpose |
|--------|---------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub token |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | AWS region (optional) |

## Monitoring & Logs

### GitHub Actions
```bash
# View workflow runs
gh run list --repo Wilcolab/Anythink-Market-worofjem

# View specific run logs
gh run view <RUN_ID> --log
```

### AWS CloudWatch (if using ECS)
```bash
aws logs tail /ecs/anythink-market --follow
```

### Docker Hub
- View build history: https://hub.docker.com/r/username/anythink-python-server/builds
- Manage webhooks for auto-deployment

## Troubleshooting

### Docker Build Fails
- Check Dockerfile syntax: `docker build ./python-server`
- Verify all dependencies in requirements.txt/package.json
- Check build cache: `docker system prune`

### ECS Deployment Fails
- Verify task definition syntax: `aws ecs describe-task-definition --task-definition anythink-market-task`
- Check CloudWatch logs: `aws logs tail /ecs/anythink-market`
- Verify security groups allow ports 8000-8001

### Docker Hub Push Fails
- Verify Docker credentials: `docker login`
- Check image name matches repository: `docker tag app:latest username/app:latest`
- Verify user has push permissions

## Next Steps

1. **Configure GitHub secrets** for your deployment method
2. **Test workflow** by pushing to main branch
3. **Monitor first deployment** in GitHub Actions logs
4. **Set up monitoring** (Sentry, DataDog, New Relic optional)
5. **Configure auto-scaling** (optional, for production)
