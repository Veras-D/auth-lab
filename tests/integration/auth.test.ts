import request from 'supertest';
import app from '../../src/app.js';
import '../setup.js'

describe('Auth Endpoints', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    await request(app).post('/api/users/register').send({
      username: 'authuser',
      email: 'authuser@example.com',
      password: 'Auth1234!',
    });

    const loginRes = await request(app).post('/api/users/login').send({
      email: 'authuser@example.com',
      password: 'Auth1234!',
    });

    accessToken = loginRes.body.accessToken;
    refreshToken = loginRes.body.refreshToken;
  });

  it('should access protected profile route', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'authuser@example.com');
  });

  it('should refresh the token', async () => {
    const res = await request(app)
      .post('/api/auth/token/refresh')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should logout the user', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
