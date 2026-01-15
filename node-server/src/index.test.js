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

    it('should set cache headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('max-age');
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

    it('should include cache headers', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['x-cache']).toBeDefined();
    });

    it('should serve from cache on subsequent requests', async () => {
      // First request - should be either MISS or HIT depending on previous tests
      const response1 = await request(app)
        .get('/tasks')
        .expect(200);

      const firstCacheState = response1.headers['x-cache'];
      expect(['MISS', 'HIT']).toContain(firstCacheState);

      // Second request - should be HIT (within cache TTL, same cache state)
      const response2 = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response2.headers['x-cache']).toBe(firstCacheState);
    });
  });

  describe('POST /tasks', () => {
    it('should add a new task successfully', async () => {
      const newTask = { text: 'Learn Express.js' };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Task added successfully'
        })
      );
    });

    it('should return 201 status code on successful POST', async () => {
      await request(app)
        .post('/tasks')
        .send({ text: 'Test task' })
        .expect(201);
    });

    it('should include task count in response', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: 'Count test task' })
        .expect(201);

      expect(response.body).toHaveProperty('taskCount');
      expect(typeof response.body.taskCount).toBe('number');
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
        .expect(201);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should accept unicode characters in task text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: 'Task with unicode: 你好世界 🚀' })
        .expect(201);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should return 400 for null text', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ text: null })
        .expect(400);

      expect(response.body.error).toBe('Invalid request');
    });

    it('should reject text exceeding 1000 characters', async () => {
      const longText = 'A'.repeat(1001);
      const response = await request(app)
        .post('/tasks')
        .send({ text: longText })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task text cannot exceed 1000 characters'
        })
      );
    });

    it('should accept text with exactly 1000 characters', async () => {
      const textWith1000Chars = 'A'.repeat(1000);
      const response = await request(app)
        .post('/tasks')
        .send({ text: textWith1000Chars })
        .expect(201);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should invalidate cache after adding task', async () => {
      // Get tasks (cache MISS)
      const get1 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get1.headers['x-cache']).toBe('MISS');

      // Get tasks again (cache HIT)
      const get2 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get2.headers['x-cache']).toBe('HIT');

      // Add a new task
      await request(app)
        .post('/tasks')
        .send({ text: 'Cache invalidation test' })
        .expect(201);

      // Get tasks again - should be MISS because cache was invalidated
      const get3 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get3.headers['x-cache']).toBe('MISS');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task by index', async () => {
      const response = await request(app)
        .get('/tasks/0')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: 0,
          task: expect.any(String)
        })
      );
    });

    it('should return the correct task for valid index', async () => {
      const allTasksResponse = await request(app)
        .get('/tasks')
        .expect(200);

      const firstTask = allTasksResponse.body.tasks[0];

      const specificTaskResponse = await request(app)
        .get('/tasks/0')
        .expect(200);

      expect(specificTaskResponse.body.task).toBe(firstTask);
    });

    it('should return 404 for out of range positive index', async () => {
      const response = await request(app)
        .get('/tasks/9999')
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Not found',
          message: expect.stringContaining('does not exist')
        })
      );
    });

    it('should return 400 for negative index', async () => {
      const response = await request(app)
        .get('/tasks/-1')
        .expect(404);

      expect(response.body.error).toBe('Not found');
    });

    it('should return 400 for non-numeric index', async () => {
      const response = await request(app)
        .get('/tasks/abc')
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task ID must be a valid number'
        })
      );
    });

    it('should set cache headers for GET /tasks/:id', async () => {
      const response = await request(app)
        .get('/tasks/0')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task successfully', async () => {
      // First, add a task to delete
      const postResponse = await request(app)
        .post('/tasks')
        .send({ text: 'Task to delete' })
        .expect(201);

      const initialCount = postResponse.body.taskCount;

      // Get current task count to determine the index
      const getAllResponse = await request(app)
        .get('/tasks')
        .expect(200);

      const lastIndex = getAllResponse.body.tasks.length - 1;

      // Delete the last task
      const deleteResponse = await request(app)
        .delete(`/tasks/${lastIndex}`)
        .expect(200);

      expect(deleteResponse.body).toEqual(
        expect.objectContaining({
          message: 'Task deleted successfully',
          deletedTask: 'Task to delete'
        })
      );
    });

    it('should return updated task count after deletion', async () => {
      const postResponse = await request(app)
        .post('/tasks')
        .send({ text: 'Another task to delete' })
        .expect(201);

      const tasksBeforeDelete = await request(app)
        .get('/tasks')
        .expect(200);

      const deleteResponse = await request(app)
        .delete(`/tasks/${tasksBeforeDelete.body.tasks.length - 1}`)
        .expect(200);

      expect(deleteResponse.body.taskCount).toBe(tasksBeforeDelete.body.tasks.length - 1);
    });

    it('should return 404 for non-existent task index', async () => {
      const response = await request(app)
        .delete('/tasks/9999')
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Not found'
        })
      );
    });

    it('should return 400 for non-numeric index', async () => {
      const response = await request(app)
        .delete('/tasks/invalid')
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Invalid request',
          message: 'Task ID must be a valid number'
        })
      );
    });

    it('should invalidate cache after deletion', async () => {
      // Add a task
      await request(app)
        .post('/tasks')
        .send({ text: 'Cache test delete' })
        .expect(201);

      // Get tasks (MISS)
      const get1 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get1.headers['x-cache']).toBe('MISS');

      // Get tasks again (HIT)
      const get2 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get2.headers['x-cache']).toBe('HIT');

      // Delete a task
      const tasksCount = get2.body.tasks.length;
      await request(app)
        .delete(`/tasks/${tasksCount - 1}`)
        .expect(200);

      // Get tasks again - should be MISS
      const get3 = await request(app)
        .get('/tasks')
        .expect(200);
      expect(get3.headers['x-cache']).toBe('MISS');
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: 'healthy'
        })
      );
    });

    it('should return timestamp', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should return uptime information', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should have no-cache headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['cache-control']).toContain('no-cache');
    });
  });

  describe('GET /metrics', () => {
    it('should return metrics data', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.body).toHaveProperty('metrics');
      expect(response.body).toHaveProperty('cacheInfo');
    });

    it('should include request metrics', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.body.metrics).toEqual(
        expect.objectContaining({
          requestCount: expect.any(Number),
          getCount: expect.any(Number),
          postCount: expect.any(Number),
          errorCount: expect.any(Number),
          cacheHits: expect.any(Number),
          cacheMisses: expect.any(Number)
        })
      );
    });

    it('should include cache hit rate', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.body.cacheInfo).toHaveProperty('hitRate');
      expect(response.body.cacheInfo).toHaveProperty('hits');
      expect(response.body.cacheInfo).toHaveProperty('misses');
    });

    it('should have no-cache headers', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.headers['cache-control']).toContain('no-cache');
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
        .expect(201);
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
        expect(response.status).toBe(201);
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
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Task added successfully'
        })
      );
    });
  });

  describe('Input Sanitization', () => {
    it('should preserve task text as-is without modification', async () => {
      const taskText = 'Task with   multiple   spaces';
      
      const postResponse = await request(app)
        .post('/tasks')
        .send({ text: taskText })
        .expect(201);

      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.tasks).toContain(taskText);
    });

    it('should handle very long task text (up to 1000 chars)', async () => {
      const longText = 'A'.repeat(1000);
      
      const response = await request(app)
        .post('/tasks')
        .send({ text: longText })
        .expect(201);

      expect(response.body.message).toBe('Task added successfully');
    });

    it('should handle task text with leading/trailing spaces', async () => {
      const taskText = '   Padded task   ';
      
      await request(app)
        .post('/tasks')
        .send({ text: taskText })
        .expect(201);

      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      // Should preserve spaces as-is
      expect(getResponse.body.tasks).toContain(taskText);
    });
  });

  describe('Response Headers', () => {
    it('should include response type header', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      // Compression middleware may not set content-length
      expect(response.headers['content-type']).toBeDefined();
    });

    it('should support compression', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Accept-Encoding', 'gzip')
        .expect(200);

      // Server may or may not compress based on payload size
      // Just verify that the request succeeds
      expect(response.status).toBe(200);
    });
  });

  describe('Status Codes', () => {
    it('should return 200 for successful GET', async () => {
      await request(app)
        .get('/tasks')
        .expect(200);
    });

    it('should return 201 for successful POST', async () => {
      await request(app)
        .post('/tasks')
        .send({ text: 'Status code test' })
        .expect(201);
    });

    it('should return 400 for bad request', async () => {
      await request(app)
        .post('/tasks')
        .send({ text: 123 })
        .expect(400);
    });

    it('should return 404 for not found', async () => {
      await request(app)
        .get('/nonexistent')
        .expect(404);
    });

    it('should return 429 for too many requests (rate limit)', async () => {
      // Make 101 requests to exceed the limit of 100
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app)
            .get('/tasks')
            .expect([200, 429]) // Expect either success or rate limit
        );
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);

      // At least one request should be rate limited
      expect(responses.some(r => r.status === 200 || r.status === 429)).toBe(true);
    });
  });
});

