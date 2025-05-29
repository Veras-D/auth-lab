import request from 'supertest';
import app from '../../src/app';

describe('User Endpoints', () => {
  let createdUserId: string;

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test1234!',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdUserId = res.body._id;
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test1234!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should update the user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ username: 'updatedUser' });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('updatedUser');
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete the user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });
});
