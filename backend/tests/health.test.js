const request = require('supertest');
const { getApp } = require('./setup');
const mongoose = require('mongoose');

const app = getApp();

describe('Health Endpoints', () => {
  it('GET /health should return 200 with status "healthy"', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /health/db should return 200 when DB connected', async () => {
    const res = await request(app).get('/health/db');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBe('connected');
  });
});
