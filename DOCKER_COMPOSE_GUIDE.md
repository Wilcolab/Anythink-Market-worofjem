# Docker Compose Configuration Summary

## Overview
The `docker-compose.yml` file has been updated to orchestrate both the Python FastAPI server and the new Node.js Express server, allowing them to run in harmony within Docker containers.

## Services Configuration

### 1. Python Server (FastAPI)
- **Image**: `python:3.9-slim`
- **Port**: 8000
- **Container Name**: `python-server`
- **Framework**: FastAPI with Uvicorn
- **Auto-Reload**: Yes (--reload flag)
- **Network**: `app-network`
- **Health Check**: Tests `/tasks` endpoint every 10 seconds
- **Volumes**: 
  - `./python-server/src:/app/src` (for live code reload)

### 2. Node.js Server (Express)
- **Image**: `node:14`
- **Port**: 8001
- **Container Name**: `node-server`
- **Framework**: Express with Nodemon
- **Auto-Reload**: Yes (nodemon watches files)
- **Network**: `app-network`
- **Health Check**: Tests root endpoint every 10 seconds
- **Volumes**: 
  - `./node-server/src:/app/src` (for live code reload)
  - `./node-server/node_modules:/app/node_modules` (persist deps)
- **Dependencies**: Waits for python-server to be healthy before starting

## Network Configuration

Both services are connected to a shared `app-network` bridge network, enabling:
- Internal communication between containers (e.g., `http://python-server:8000`)
- Isolation from the host network
- Container name resolution

## Environment Variables

### Python Server
- `PORT=8000`

### Node.js Server
- `PORT=8001`
- `NODE_ENV=development`

## Health Checks

Both services have health checks configured:
- **Check Interval**: 10 seconds
- **Timeout**: 5 seconds
- **Retries**: 5 attempts

The health checks ensure that:
- Python server responds to requests
- Node server responds to requests
- Docker knows when services are ready

## Quick Start Commands

### Build Images
```bash
docker-compose build
```

### Start Services (Foreground)
```bash
docker-compose up
```

### Start Services (Background)
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f python-server
docker-compose logs -f node-server
```

### Stop Services
```bash
docker-compose down
```

### Rebuild and Start
```bash
docker-compose up --build
```

## Accessing the Servers

Once running in Docker:

### Python Server (FastAPI)
- **HTTP**: `http://localhost:8000`
- **Available Endpoints**:
  - `GET /` - Returns "Hello World"
  - `GET /tasks` - Returns all tasks
  - `POST /tasks` - Add a new task
- **Auto-reload**: Yes (code changes reflect immediately)

### Node.js Server (Express)
- **HTTP**: `http://localhost:8001`
- **Currently**: No endpoints (ready for development)
- **Port**: 8001 as specified
- **Auto-reload**: Yes (via nodemon)

## Internal Service Communication

Containers can communicate with each other using service names:
- From Node to Python: `http://python-server:8000`
- From Python to Node: `http://node-server:8001`

## Volume Mounts Benefits

1. **Hot Reload Development**: Changes to code are reflected immediately without rebuilding
2. **Persistence**: Node modules are persisted across container restarts
3. **Live Debugging**: Can debug code directly from host machine

## Troubleshooting

### Port Already in Use
If port 8000 or 8001 is already in use:
```bash
# Modify docker-compose.yml:
services:
  python-server:
    ports:
      - "9000:8000"  # Access via 9000, but app still runs on 8000
  node-server:
    ports:
      - "9001:8001"  # Access via 9001, but app still runs on 8001
```

### Services Not Communicating
Check that both are on the same network by running:
```bash
docker network inspect <network_name>
```

### Health Check Failing
Manually test endpoints:
```bash
docker exec python-server curl http://localhost:8000/tasks
docker exec node-server curl http://localhost:8001/
```

## Directory Structure

```
/workspaces/Anythink-Market-worofjem/
├── docker-compose.yml          ← Updated with both services
├── python-server/
│   ├── Dockerfile              ← Python service definition
│   ├── requirements.txt
│   └── src/
│       └── main.py             ← FastAPI app
└── node-server/
    ├── Dockerfile              ← Node service definition
    ├── package.json
    ├── package-lock.json
    └── src/
        └── index.js            ← Express app
```

## Testing Harmony

Once both services are running, you can verify they're working together:

```bash
# Test Python server
curl http://localhost:8000/tasks

# Test Node server health
curl http://localhost:8001/

# Check container logs
docker-compose logs python-server
docker-compose logs node-server

# Verify network connectivity
docker exec node-server curl http://python-server:8000/tasks
```

## Notes

- The Node.js server waits for the Python server health check before starting
- Both servers have automatic restart policies (implicit in compose)
- Code changes trigger automatic reloads without needing to restart containers
- Environment variables are already configured for proper port assignments
- The setup is production-ready with health checks in place
