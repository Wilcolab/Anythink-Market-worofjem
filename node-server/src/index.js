const express = require('express');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(express.json());

// Initial tasks array (migrated from Python server)
const tasks = [
  "Write a diary entry from the future",
  "Create a time machine from a cardboard box",
  "Plan a trip to the dinosaurs",
  "Draw a futuristic city",
  "List items to bring on a time-travel adventure"
];

// Routes migrated from Python FastAPI server

/**
 * GET /
 * Returns a simple "Hello World" message
 * Migrated from: @app.get("/") in Python
 */
app.get('/', (req, res) => {
  res.send('Hello World');
});

/**
 * GET /tasks
 * Returns all tasks in JSON format
 * Migrated from: @app.get("/tasks") in Python
 */
app.get('/tasks', (req, res) => {
  try {
    res.json({ tasks: tasks });
  } catch (error) {
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
    
    // Add the task
    tasks.push(text);
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error in POST /tasks:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while adding the task' 
    });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested route ${req.method} ${req.path} does not exist` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred on the server' 
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
