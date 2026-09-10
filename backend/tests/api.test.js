process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const { db } = require('../db');

afterAll(() => {
  db.close();
});

describe('TaskFlow API', () => {
  test('GET /api/health responde ok con versión', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });

  test('POST /api/tasks crea una tarea', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Preparar clase de GC' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Preparar clase de GC');
    expect(res.body.completed).toBe(0);
  });

  test('GET /api/tasks lista las tareas creadas', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/tasks/:id marca una tarea como completada', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarea temporal' });
    const id = created.body.id;

    const res = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  test('DELETE /api/tasks/:id elimina una tarea', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Para borrar' });
    const id = created.body.id;

    const res = await request(app).delete(`/api/tasks/${id}`);
    expect(res.status).toBe(204);
  });

  test('POST /api/tasks sin title responde 400', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.status).toBe(400);
  });
});
