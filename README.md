# Anythink Market - Dual Server Application

This project contains both a Python FastAPI server and a Node.js Express server, demonstrating a successful migration of endpoints from Python to Node.js while maintaining both implementations.

## 🚀 Project Overview

The application provides a simple task management API implemented in two different technologies:
- **Python Server** (FastAPI) - Port 8000
- **Node.js Server** (Express) - Port 8001

Both servers implement the same API endpoints with feature parity.

## 📁 Project Structure

### Python Server (`python-server/`)
- `src/main.py`: FastAPI server implementation with task management endpoints
- `src/__init__.py`: Python package marker
- `requirements.txt`: Python dependencies (FastAPI, uvicorn)
- `Dockerfile`: Docker image configuration for Python server

### Node.js Server (`node-server/`)
- `src/index.js`: Express server implementation with migrated endpoints
- `package.json`: Node.js dependencies and scripts (Express, nodemon)
- `Dockerfile`: Docker image configuration for Node.js server
- `.dockerignore`: Files to exclude from Docker build
- `.gitignore`: Files to exclude from git

### Configuration
- `docker-compose.yml`: Orchestrates both servers with proper port mapping and volumes

## 🏃 Getting Started

### Run Both Servers

Build and start both Docker containers:

```shell
docker-compose up
```

This will start:
- **Python Server** at `http://localhost:8000`
- **Node.js Server** at `http://localhost:8001`

### Run Individual Servers

Start only the Python server:
```shell
docker-compose up python-server
```

Start only the Node.js server:
```shell
docker-compose up node-server
```

### Development with Hot Reload

The Node.js server is configured with **nodemon** for automatic reloading on code changes. Simply edit files in `node-server/src/` and the server will restart automatically.

## 📡 API Endpoints

Both servers implement the same API:

### `GET /`
Returns a simple "Hello World" message.

**Response:**
```json
"Hello World"
```

### `GET /tasks`
Retrieves all tasks from the task list.

**Response:**
```json
{
  "tasks": [
    "Write a diary entry from the future",
    "Create a time machine from a cardboard box",
    "Plan a trip to the dinosaurs",
    "Draw a futuristic city",
    "List items to bring on a time-travel adventure"
  ]
}
```

### `POST /tasks`
Adds a new task to the task list.

**Request Body:**
```json
{
  "text": "Your task description here"
}
```

**Response:**
```json
{
  "message": "Task added successfully"
}
```

## 🔄 Migration Details

The endpoints were successfully migrated from Python FastAPI to Node.js Express:

- ✅ All endpoints maintain the same API contract
- ✅ Response formats are identical between servers
- ✅ Input validation implemented in both servers
- ✅ In-memory task storage with same default data
- ✅ Hot-reload enabled for Node.js development

## 🧪 Testing the APIs

### Test Python Server (Port 8000)
```bash
# Get hello world
curl http://localhost:8000/

# Get all tasks
curl http://localhost:8000/tasks

# Add a task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text":"New task"}'
```

### Test Node.js Server (Port 8001)
```bash
# Get hello world
curl http://localhost:8001/

# Get all tasks
curl http://localhost:8001/tasks

# Add a task
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"text":"New task"}'
```

## 🛠️ Technologies Used

- **Python**: FastAPI, uvicorn
- **Node.js**: Express, nodemon
- **Docker**: Multi-container orchestration with Docker Compose
- **Development**: Hot-reload enabled for rapid development
