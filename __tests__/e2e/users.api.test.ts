import request from 'supertest';
import { app } from '../../src/app.config';

describe('users routes', () => {
  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  afterAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  describe('GET "/" - find all users', () => {
    it('should return object with default query params, pagesCount = 0, totalCount = 0, items = []', async () => {
      await request(app)
        .get('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });
  });

  describe('POST "/" - create user', () => {
    const invalidUser = {
      login: '',
      email: '',
      password: '',
    };

    const validUser = {
      login: 'admin',
      email: 'admin@mail.com',
      password: 'qwerty',
    };

    it('given invalid user should return 400', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(invalidUser)
        .expect(400);

      expect(response.body.errorsMessages.length).toBe(3);
    });

    it('given valid user but no authorization should return 401', async () => {
      await request(app).post('/users').send(validUser).expect(401);
    });

    it('given valid user and authorization should return newly created user', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(validUser)
        .expect(201);

      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.login).toBe('admin');
      expect(response.body.email).toBe('admin@mail.com');
      expect(response.body.createdAt).toEqual(expect.any(String));
    });
  });

  describe('DELETE "/users/{id}"  - delete user by ID', () => {
    const validUser = {
      login: 'admin',
      email: 'admin@mail.com',
      password: 'qwerty',
    };

    it('Should delete user by ID and receive 401 if not authorized', async () => {
      const result = await request(app)
        .post('/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(validUser)
        .expect(201);

      await request(app).delete(`/users/${result.body.id}`).expect(401);

      await request(app)
        .delete(`/users/${result.body.id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(204);
    });

    it('Should receive 404 if specified user does not exist', async () => {
      await request(app)
        .delete(`/users/123`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(404);
    });
  });
});
