const request = require('supertest');
const { getApp } = require('./setup');
const app = getApp();

describe('Task Endpoints', () => {
  let token;
  const testUser = {
    name: 'Task User',
    email: 'taskuser@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    token = res.body.data.token;
  });

  describe('POST /api/tasks', () => {
    it('Should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Task', description: 'Task description' });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Task');
    });

    it('Should fail without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Task description' });
      expect(res.status).toBe(400);
    });

    it('Should fail without auth', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Task 1', status: 'pending' });
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Task 2', status: 'completed' });
    });

    it('Should return user tasks', async () => {
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.tasks)).toBe(true);
      expect(res.body.data.tasks.length).toBeGreaterThan(0);
    });

    it('Should filter by status', async () => {
      const res = await request(app).get('/api/tasks?status=completed').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.tasks.every(task => task.status === 'completed')).toBe(true);
    });

    it('Should search by title', async () => {
      const res = await request(app).get('/api/tasks?search=Task 1').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.tasks[0].title).toContain('Task 1');
    });
  });

  describe('GET /api/tasks/:id', () => {
    let specificTaskId;
    beforeEach(async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Specific Task' });
      specificTaskId = res.body.data._id;
    });

    it('Should return a specific task', async () => {
      const res = await request(app).get(`/api/tasks/${specificTaskId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Specific Task');
    });

    it('Should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/tasks/${fakeId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let updateTaskId;
    beforeEach(async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Update Task' });
      updateTaskId = res.body.data._id;
    });

    it('Should update a task', async () => {
      const res = await request(app).put(`/api/tasks/${updateTaskId}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Title' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('Should mark as completed', async () => {
      const res = await request(app).put(`/api/tasks/${updateTaskId}`).set('Authorization', `Bearer ${token}`).send({ status: 'completed' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let deleteTaskId;
    beforeEach(async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Delete Task' });
      deleteTaskId = res.body.data._id;
    });

    it('Should delete a task', async () => {
      const res = await request(app).delete(`/api/tasks/${deleteTaskId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    it('Should return 404 for already deleted task', async () => {
      await request(app).delete(`/api/tasks/${deleteTaskId}`).set('Authorization', `Bearer ${token}`);
      const res = await request(app).delete(`/api/tasks/${deleteTaskId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/tasks/stats', () => {
    it('Should return task statistics', async () => {
      const res = await request(app).get('/api/tasks/stats').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });
});
