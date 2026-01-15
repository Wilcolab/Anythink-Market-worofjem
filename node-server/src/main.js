const express = require('express');
const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Middleware to parse JSON
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

// ============================================================================
// ROUTES - MIGRATED FROM PYTHON SERVER
// ============================================================================

// GET / - Return "Hello World"
// Python equivalent: @app.get("/") def get_tasks(): return "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World');
});

// POST /tasks - Add a new task
// Python equivalent: @app.post("/tasks") def add_task(task: Task):
//                      tasks.append(task.text)
//                      return {"message": "Task added successfully"}
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
    
    // Add the task (same logic as Python)
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

// GET /tasks - Get all tasks
// Python equivalent: @app.get("/tasks") def get_tasks(): return {"tasks": tasks}
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

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested route ${req.method} ${req.path} does not exist` 
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred on the server' 
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Server is running on http://0.0.0.0:${PORT}`);
});
