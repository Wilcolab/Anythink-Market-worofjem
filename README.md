# Anythink Market - Multi-Server Task Management Application

This project contains a multi-container application with both a Python FastAPI server and a Node.js Express server for managing a task list. The Node.js server is a complete migration from the Python FastAPI implementation with feature parity and comprehensive unit test coverage.

## Project Structure

```
├── python-server/
│   ├── src/
│   │   ├── __init__.py
│   │   └── main.py              # Python FastAPI server implementation
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile               # Python server Docker image
├── node-server/
│   ├── src/
│   │   ├── index.js             # Express.js server implementation (migrated from Python)
│   │   └── index.test.js        # Jest unit tests (31 tests, 76%+ coverage)
│   ├── package.json             # Node.js dependencies and scripts
│   ├── jest.config.js           # Jest test configuration
│   ├── Dockerfile               # Node.js server Docker image
│   └── .dockerignore
├── docker-compose.yml           # Multi-container orchestration
├── DOCKER_COMPOSE_GUIDE.md      # Detailed deployment documentation
└── README.md                    # This file
```

## Features

- **Python FastAPI Server**: Original implementation on port 8000
- **Node.js Express Server**: Complete migration with feature parity on port 8001
- **Docker Compose**: Multi-container orchestration with health checks
- **Comprehensive Testing**: 31 Jest unit tests with 76%+ coverage
- **Input Validation**: Both servers validate task inputs (required, string type, non-empty)
- **Error Handling**: Proper HTTP status codes and error messages
- **Hot Reload**: Auto-reload on file changes during development

## Getting Started

### With Docker Compose

To run both servers using Docker, execute:

```shell
docker compose up
```

This will:
- Build Docker images for both Python and Node.js servers
- Start both services on the `app-network` bridge
- Run health checks for service readiness
- Configure port forwarding (Python: 8000, Node.js: 8001)

### Local Development

#### Python Server

```bash
cd python-server
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### Node.js Server

```bash
cd node-server
npm install
npm start                    # Start with Nodemon (auto-reload)
npm test                     # Run Jest test suite with coverage
npm run test:watch         # Run tests in watch mode
```

## API Routes

Both servers provide the same API endpoints:

### GET /
Returns a simple "Hello World" message.

**Response:**
```
Hello World
```

### GET /tasks
Retrieves all tasks in the task list.

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

### POST /tasks
Adds a new task to the task list.

**Request Body:**
```json
{
  "text": "Your task description"
}
```

**Response (Success):**
```json
{
  "message": "Task added successfully"
}
```

**Response (Error):**
```json
{
  "error": "Invalid request",
  "message": "Task text is required"
}
```

**Validation Rules:**
- `text` field is required
- `text` must be a string
- `text` cannot be empty or whitespace-only

## Testing

The Node.js Express server includes comprehensive Jest unit tests:

```bash
cd node-server
npm install
npm test                    # Run tests with coverage report
```

**Test Coverage:**
- 31 tests total
- ✅ All tests passing
- GET / endpoint (2 tests)
- GET /tasks endpoint (4 tests)
- POST /tasks validation (10 tests)
- 404 error handling (2 tests)
- Content-Type headers (3 tests)
- Request method handling (2 tests)
- Concurrent request handling (2 tests)
- Python compatibility verification (3 tests)
- Input sanitization (2 tests)

## Migration Notes

The Node.js/Express server is a complete, feature-identical migration from the Python FastAPI server:

| Feature | Python FastAPI | Node.js Express |
|---------|-----------------|-----------------|
| Framework | FastAPI 0.128.0 | Express 5.2.1 |
| Validation | Pydantic models | Manual validation |
| Testing | pytest (not included) | Jest + Supertest |
| Task Storage | In-memory list | In-memory list |
| Response Format | Identical JSON | Identical JSON |
| Error Handling | 400 status + error message | 400 status + error message |

## Port Configuration

- **Python FastAPI Server**: Port 8000
- **Node.js Express Server**: Port 3000 (development), 8001 (Docker)
- **Docker Network**: `app-network` (bridge driver)

## Health Checks

Both services include health checks in `docker-compose.yml`:
- **Interval**: 10 seconds
- **Timeout**: 5 seconds
- **Retries**: 5 attempts
- Python: Checks `/tasks` endpoint
- Node.js: Checks `/` endpoint

## Documentation

See [DOCKER_COMPOSE_GUIDE.md](DOCKER_COMPOSE_GUIDE.md) for detailed deployment and troubleshooting information.
