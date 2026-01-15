# API Reference Guide

## Base URL
```
http://localhost:8001
```

## Endpoints

### 1. GET / - Root Endpoint
Returns a simple health greeting.

**Request**:
```bash
curl http://localhost:8001/
```

**Response** (200 OK):
```
Hello World
```

**Headers**:
```
Cache-Control: public, max-age=3600
Content-Type: text/html; charset=utf-8
```

---

### 2. GET /tasks - Get All Tasks
Retrieve all tasks with built-in caching.

**Request**:
```bash
curl http://localhost:8001/tasks
```

**Response** (200 OK):
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

**Headers**:
```
Cache-Control: public, max-age=30
X-Cache: MISS (first request) or HIT (cached)
Content-Type: application/json
```

**Query Parameters**: None

---

### 3. POST /tasks - Add New Task
Create a new task in the list.

**Request**:
```bash
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy groceries"}'
```

**Response** (201 Created):
```json
{
  "message": "Task added successfully",
  "taskCount": 6
}
```

**Request Body**:
```json
{
  "text": "Your task description (1-1000 characters)"
}
```

**Validation Rules**:
- ✓ `text` is required
- ✓ `text` must be a string
- ✓ `text` cannot be empty or whitespace-only
- ✓ `text` must not exceed 1000 characters

**Error Responses**:

**400 Bad Request** (missing text):
```json
{
  "error": "Invalid request",
  "message": "Task text is required"
}
```

**400 Bad Request** (invalid type):
```json
{
  "error": "Invalid request",
  "message": "Task text must be a string"
}
```

**400 Bad Request** (exceeds length):
```json
{
  "error": "Invalid request",
  "message": "Task text cannot exceed 1000 characters"
}
```

---

### 4. GET /tasks/:id - Get Specific Task
Retrieve a single task by its index.

**Request**:
```bash
curl http://localhost:8001/tasks/0
```

**Response** (200 OK):
```json
{
  "id": 0,
  "task": "Write a diary entry from the future"
}
```

**Path Parameters**:
- `id`: Task index (0-based, numeric)

**Error Responses**:

**400 Bad Request** (non-numeric ID):
```json
{
  "error": "Invalid request",
  "message": "Task ID must be a valid number"
}
```

**404 Not Found** (ID out of range):
```json
{
  "error": "Not found",
  "message": "Task with ID 999 does not exist"
}
```

---

### 5. DELETE /tasks/:id - Delete Task
Remove a task from the list.

**Request**:
```bash
curl -X DELETE http://localhost:8001/tasks/0
```

**Response** (200 OK):
```json
{
  "message": "Task deleted successfully",
  "deletedTask": "Write a diary entry from the future",
  "taskCount": 4
}
```

**Path Parameters**:
- `id`: Task index (0-based, numeric)

**Error Responses**:

**400 Bad Request** (non-numeric ID):
```json
{
  "error": "Invalid request",
  "message": "Task ID must be a valid number"
}
```

**404 Not Found** (ID out of range):
```json
{
  "error": "Not found",
  "message": "Task with ID 999 does not exist"
}
```

---

### 6. GET /health - Health Check
Monitor server health and uptime.

**Request**:
```bash
curl http://localhost:8001/health
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T10:30:45.123Z",
  "uptime": 3600.5
}
```

**Use Cases**:
- Load balancer health probes
- Docker/Kubernetes health checks
- Monitoring dashboards
- Uptime monitoring

**Headers**:
```
Cache-Control: no-cache
```

---

### 7. GET /metrics - Performance Metrics
Get performance and caching statistics.

**Request**:
```bash
curl http://localhost:8001/metrics
```

**Response** (200 OK):
```json
{
  "metrics": {
    "requestCount": 150,
    "getCount": 85,
    "postCount": 42,
    "errorCount": 2,
    "cacheHits": 45,
    "cacheMisses": 35
  },
  "cacheInfo": {
    "hitRate": "56.25%",
    "hits": 45,
    "misses": 35
  }
}
```

**Fields Explained**:
- `requestCount`: Total requests processed
- `getCount`: GET request count
- `postCount`: POST request count
- `errorCount`: Failed requests
- `cacheHits`: Successful cache hits
- `cacheMisses`: Cache misses
- `hitRate`: Cache hit percentage

**Use Cases**:
- Performance monitoring
- Load analysis
- Cache effectiveness evaluation
- System metrics collection

**Headers**:
```
Cache-Control: no-cache
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successfully retrieved data |
| 201 | Created | Task successfully added |
| 400 | Bad Request | Invalid input/validation error |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected server error |

---

## Rate Limiting

**Rate Limit**: 100 requests per 15 minutes per IP

When rate limit is exceeded:

**Response** (429 Too Many Requests):
```json
{
  "message": "Too many requests from this IP, please try again later"
}
```

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
```

---

## Caching

### Cache Behavior

**GET /tasks** has a 30-second cache:

1. **First request**: `X-Cache: MISS`
   - Full data processing
   - Response cached

2. **Subsequent requests (within 30s)**: `X-Cache: HIT`
   - Cached response returned
   - No processing

3. **After 30 seconds**: Cache expires
   - Next request: `X-Cache: MISS`
   - Cache refreshed

### Cache Invalidation

Cache is automatically cleared when:
- New task is added (POST /tasks)
- Task is deleted (DELETE /tasks/:id)

**Example**:
```bash
# Request 1: MISS
curl http://localhost:8001/tasks
# X-Cache: MISS

# Request 2: HIT (within 30s)
curl http://localhost:8001/tasks
# X-Cache: HIT

# Request 3: Add task (invalidates cache)
curl -X POST http://localhost:8001/tasks -d '{"text":"New task"}'

# Request 4: MISS (cache was cleared)
curl http://localhost:8001/tasks
# X-Cache: MISS
```

---

## Request/Response Examples

### Example 1: Create and Retrieve Task

```bash
# Step 1: Add a task
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Node.js"}'

# Response:
# {
#   "message": "Task added successfully",
#   "taskCount": 6
# }

# Step 2: Get all tasks
curl http://localhost:8001/tasks

# Response:
# {
#   "tasks": [
#     "Write a diary entry from the future",
#     "...",
#     "Learn Node.js"
#   ]
# }

# Step 3: Get specific task (last one added)
curl http://localhost:8001/tasks/5

# Response:
# {
#   "id": 5,
#   "task": "Learn Node.js"
# }
```

### Example 2: Delete Task

```bash
# Step 1: Delete task at index 0
curl -X DELETE http://localhost:8001/tasks/0

# Response:
# {
#   "message": "Task deleted successfully",
#   "deletedTask": "Write a diary entry from the future",
#   "taskCount": 4
# }

# Step 2: Verify deletion by getting all tasks
curl http://localhost:8001/tasks

# Response: Tasks list now has 4 items instead of 5
```

### Example 3: Monitor Performance

```bash
# Check server health
curl http://localhost:8001/health

# Get performance metrics
curl http://localhost:8001/metrics

# Response shows cache hit rate, request counts, etc.
```

---

## Error Handling Examples

### Invalid Task Text (Too Long)
```bash
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$(python -c 'print(\"A\" * 1001)')\"}"

# Response:
# {
#   "error": "Invalid request",
#   "message": "Task text cannot exceed 1000 characters"
# }
```

### Non-Existent Task ID
```bash
curl http://localhost:8001/tasks/9999

# Response:
# {
#   "error": "Not found",
#   "message": "Task with ID 9999 does not exist"
# }
```

### Invalid Route
```bash
curl http://localhost:8001/invalid

# Response:
# {
#   "error": "Not Found",
#   "message": "The requested route GET /invalid does not exist"
# }
```

---

## Testing the API

### Using cURL
```bash
# Get all tasks
curl http://localhost:8001/tasks

# Add task
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "New task"}'

# Delete task
curl -X DELETE http://localhost:8001/tasks/0

# Check health
curl http://localhost:8001/health
```

### Using JavaScript/Fetch
```javascript
// Get all tasks
fetch('http://localhost:8001/tasks')
  .then(res => res.json())
  .then(data => console.log(data));

// Add task
fetch('http://localhost:8001/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'New task' })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Delete task
fetch('http://localhost:8001/tasks/0', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Python/Requests
```python
import requests

# Get all tasks
response = requests.get('http://localhost:8001/tasks')
print(response.json())

# Add task
response = requests.post('http://localhost:8001/tasks', 
  json={'text': 'New task'})
print(response.json())

# Delete task
response = requests.delete('http://localhost:8001/tasks/0')
print(response.json())

# Check health
response = requests.get('http://localhost:8001/health')
print(response.json())
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-15 | Initial release with optimizations |

---

**Last Updated**: January 15, 2026
