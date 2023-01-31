import request from 'supertest';
import { app } from '../../src/app.config';

describe('Auth routes', () => {
  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  afterAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  describe('POST "/login" - login user to the system', () => {
    const user = {
      login: 'ecoAdmin',
      email: 'au@cronosport.ru',
      password: 'qwerty',
    };
    const userLoginData = {
      loginOrEmail: 'ecoAdmin',
      password: 'qwerty',
    };
    const incorrectUser = {
      loginOrEmail: 'ecoAdmin1',
      password: '12345',
    };
    it('Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)', async () => {
      await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(user)
        .expect(201);

      const result = await request(app).post('/auth/login').send(userLoginData).expect(200);
      expect(result.body).toHaveProperty('accessToken');
      const [refreshTokenString, _, httpOnly, secure] =
        result.headers['set-cookie'][0].split(' ');
      const refreshToken = refreshTokenString.split('=')[1];
      expect(refreshToken.length).toBeGreaterThan(1);
      expect(httpOnly).toBe('HttpOnly;');
      expect(secure).toBe('Secure');
    });

    it('given wrong login and password should return 401', async () => {
      await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(user)
        .expect(201);

      await request(app).post('/auth/login').send(incorrectUser).expect(401);
    });

    it('returns 429 if more than 5 attempts were tried from same IP address', async () => {
      await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(user)
        .expect(201);

      for (let i = 0; i < 6; i++) {
        await request(app).post('/auth/login').send(userLoginData);
      }
      await request(app).post('/auth/login').send(userLoginData).expect(429);
    });
  });
});
