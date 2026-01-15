const request = require('supertest');
const app = require('../src/index');

describe('Express Routes - Migrated from Python FastAPI', () => {
  
  describe('GET /', () => {
    it('should return "Hello World" message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Hello World');
    });

    it('should return 200 status code', async () => {
      await request(app)
        .get('/')
        .expect(200);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks in JSON format', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should return initial 5 tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.tasks.length).toBeGreaterThanOrEqual(5);
    });

    it('should contain expected default tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      const defaultTasks = [
        "Write a diary entry from the future",
        "Create a time machine from a cardboard box",
        "Plan a trip to the dinosaurs",
        "Draw a futuristic city",
        "List items to bring on a time-travel adventure"
      ];

      defaultTasks.forEach(task => {
        expect(response.body.tasks).toContain(task);
      });
    });

    it('should return tasks with correct structure', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          tasks: expect.any(Array)
        })
      );
    });
  });

  describe('POST /tasks', () => {
    it('should add a new task successfully', async () => {
      const newTask = { text: 'Learn Express.js' };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Task added successfully'
      });
    });

    it('should return 200 status code on successful POST', async () => {
      await request(app)
        .post('/tasks')
        .send({ text: 'Test task' })
        .expect(200);
    });

    it('should reject request without text field', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({})
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text is required'
        })
      );
    });

    it('should reject empty text field', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text is required'
        })
      );
    });

    it('should reject whitespace-only text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: '   ' })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text cannot be empty'
        })
      );
    });

    it('should reject non-string text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: 123 })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text must be a string'
        })
      );
    });

    it('should reject array as text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: ['task1', 'task2'] })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text must be a string'
        })
      );
    });

    it('should reject object as text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: { nested: 'object' } })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text must be a string'
        })
      );
    });

    it('should accept special characters in task text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: 'Task with special chars: !@#$%^&*()' })
        .expect(200);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should accept unicode characters in task text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: 'Task with unicode: 你好世界 🚀' })
        .expect(200);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should return 400 for null text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: null })
        .expect(400);

      expect(response.body.error).toBe('Invalid request');
    });
  });

  describe('404 Error Handling', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Not Found'
        })
      );
    });

    it('should return 404 with appropriate message for undefined route', async () => {
      const response = await request(app)
        .post('/undefined-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('POST /undefined-endpoint');
    });
  });

  describe('Content-Type Headers', () => {
    it('should return JSON content-type for GET /tasks', async () => {
      await request(app)
        .get('/tasks')
        .expect('Content-Type', /json/);
    });

    it('should return text/html content-type for GET /', async () => {
      const response = await request(app)
        .get('/');

      expect(response.type).toBe('text/html');
    });

    it('should accept JSON content-type for POST /tasks', async () => {
      await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ text: 'Test' })
        .expect(200);
    });
  });

  describe('Request Method Handling', () => {
    it('should not allow POST on GET-only endpoint /', async () => {
      const response = await request(app)
        .post('/')
        .send({ data: 'test' });

      // Should either 404 or 405 (Method Not Allowed)
      expect([404, 405]).toContain(response.status);
    });

    it('should handle DELETE requests to /tasks appropriately', async () => {
      const response = await request(app)
        .delete('/tasks');

      // Should return 404 since DELETE /tasks is not implemented
      expect(response.status).toBe(404);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple concurrent GET /tasks requests', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app).get('/tasks')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tasks');
      });
    });

    it('should handle multiple concurrent POST /tasks requests', async () => {
      const requests = Array(3).fill(null).map((_, i) =>
        request(app)
          .post('/tasks')
          .send({ text: `Concurrent task ${i}` })
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task added successfully');
      });
    });
  });

  describe('Route Migration Verification', () => {
    it('should maintain Python FastAPI compatibility - GET /', async () => {
      // Python equivalent: @app.get("/") return "Hello World"
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Hello World');
    });

    it('should maintain Python FastAPI compatibility - GET /tasks returns dict with tasks key', async () => {
      // Python equivalent: @app.get("/tasks") return {"tasks": tasks}
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should maintain Python FastAPI compatibility - POST /tasks', async () => {
      // Python equivalent: @app.post("/tasks") return {"message": "Task added successfully"}
      const response = await request(app)
        .post('/tasks')
        .send({ text: 'Migration verification task' })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Task added successfully'
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should preserve task text as-is without modification', async () => {
      const taskText = 'Task with   multiple   spaces';
      
      const postResponse = await request(app)
        .post('/tasks')
        .send({ text: taskText })
        .expect(200);

      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.tasks).toContain(taskText);
    });

    it('should handle very long task text', async () => {
      const longText = 'A'.repeat(1000);
      
      const response = await request(app)
        .post('/tasks')
        .send({ text: longText })
        .expect(200);

      expect(response.body.message).toBe('Task added successfully');
    });
  });
});
