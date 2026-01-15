const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8001;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable compression for all responses (performance optimization)
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Request rate limiting (security & performance optimization)
// Limits: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  statusCode: 429,
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in test mode
});

app.use(limiter);

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

// Simple in-memory cache for GET /tasks (performance optimization)
let tasksCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 30000; // Cache for 30 seconds

function invalidateTasksCache() {
  tasksCache = null;
  cacheTimestamp = null;
}

function getCachedTasks() {
  const now = Date.now();
  if (tasksCache !== null && cacheTimestamp !== null && (now - cacheTimestamp) < CACHE_TTL) {
    return tasksCache;
  }
  return null;
}

function setCachedTasks(data) {
  tasksCache = data;
  cacheTimestamp = Date.now();
}

// ============================================================================
// DATA
// ============================================================================

// Initial tasks array (migrated from Python server)
const tasks = [
  "Write a diary entry from the future",
  "Create a time machine from a cardboard box",
  "Plan a trip to the dinosaurs",
  "Draw a futuristic city",
  "List items to bring on a time-travel adventure"
];

// Performance monitoring
const metrics = {
  requestCount: 0,
  postCount: 0,
  getCount: 0,
  errorCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
};

// ============================================================================
// MIDDLEWARE - LOGGING & METRICS
// ============================================================================

// Request logging middleware with basic metrics
app.use((req, res, next) => {
  metrics.requestCount++;
  if (req.method === 'GET') metrics.getCount++;
  if (req.method === 'POST') metrics.postCount++;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} (Total: ${metrics.requestCount})`);
  next();
});

// ============================================================================
// ROUTES - MIGRATED FROM PYTHON SERVER (OPTIMIZED)
// ============================================================================

/**
 * GET /
 * Returns a simple "Hello World" message
 * Migrated from: @app.get("/") in Python
 */
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.send('Hello World');
});

/**
 * GET /tasks
 * Returns all tasks in JSON format
 * Features: Caching, compression, proper error handling
 * Migrated from: @app.get("/tasks") in Python
 */
app.get('/tasks', (req, res) => {
  try {
    // Check cache first (performance optimization)
    const cachedData = getCachedTasks();
    if (cachedData) {
      metrics.cacheHits++;
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=30');
      return res.json(cachedData);
    }

    metrics.cacheMisses++;
    const responseData = { tasks };
    setCachedTasks(responseData);
    
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=30');
    res.json(responseData);
  } catch (error) {
    metrics.errorCount++;
    console.error('Error in GET /tasks:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while retrieving tasks' 
    });
  }
});

/**
 * POST /tasks
 * Adds a new task to the list
 * Features: Input validation, error handling
 * Migrated from: @app.post("/tasks") in Python
 * 
 * Request body:
 * {
 *   "text": "Task description"
 * }
 */
app.post('/tasks', (req, res) => {
  try {
    const { text } = req.body;
    
    // Validation: Check if text is provided
    if (!text) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Task text is required' 
      });
    }
    
    // Validation: Check if text is a string
    if (typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Task text must be a string' 
      });
    }
    
    // Validation: Check if text is not empty after trimming
    if (text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Task text cannot be empty' 
      });
    }

    // Validation: Check maximum length (1000 characters)
    if (text.length > 1000) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Task text cannot exceed 1000 characters' 
      });
    }
    
    // Add the task
    tasks.push(text);
    
    // Invalidate cache to ensure fresh data
    invalidateTasksCache();
    
    res.status(201).json({ 
      message: 'Task added successfully',
      taskCount: tasks.length 
    });
  } catch (error) {
    metrics.errorCount++;
    console.error('Error in POST /tasks:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while adding the task' 
    });
  }
});

/**
 * GET /tasks/:id
 * NEW FEATURE: Get a specific task by index
 */
app.get('/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Task ID must be a valid number'
      });
    }

    if (id < 0 || id >= tasks.length) {
      return res.status(404).json({
        error: 'Not found',
        message: `Task with ID ${id} does not exist`
      });
    }

    res.set('Cache-Control', 'public, max-age=30');
    res.json({ 
      id,
      task: tasks[id]
    });
  } catch (error) {
    metrics.errorCount++;
    console.error('Error in GET /tasks/:id:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});

/**
 * DELETE /tasks/:id
 * NEW FEATURE: Delete a specific task by index
 */
app.delete('/tasks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Task ID must be a valid number'
      });
    }

    if (id < 0 || id >= tasks.length) {
      return res.status(404).json({
        error: 'Not found',
        message: `Task with ID ${id} does not exist`
      });
    }

    const deletedTask = tasks.splice(id, 1)[0];
    invalidateTasksCache();

    res.json({ 
      message: 'Task deleted successfully',
      deletedTask,
      taskCount: tasks.length 
    });
  } catch (error) {
    metrics.errorCount++;
    console.error('Error in DELETE /tasks/:id:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});

/**
 * GET /health
 * NEW FEATURE: Health check endpoint
 */
app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /metrics
 * NEW FEATURE: Performance metrics endpoint
 */
app.get('/metrics', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json({
    metrics,
    cacheInfo: {
      hitRate: metrics.cacheHits + metrics.cacheMisses > 0 
        ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100).toFixed(2) + '%'
        : 'N/A',
      hits: metrics.cacheHits,
      misses: metrics.cacheMisses
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 - Route not found
app.use((req, res) => {
  metrics.errorCount++;
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested route ${req.method} ${req.path} does not exist` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  metrics.errorCount++;
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred on the server' 
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${new Date().toISOString()}] Server is running on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
