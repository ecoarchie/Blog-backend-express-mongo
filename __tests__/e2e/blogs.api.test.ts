import request from 'supertest';
import { app } from '../../src/app.config';
import { ObjectId } from 'mongodb';

describe('blogs routes', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  afterEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  afterAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  describe('GET / - find all blogs', () => {
    it('should return object with default query params, pagesCount = 0, totalCount = 0, items = []', async () => {
      await request(app)
        .get('/blogs')
        .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('given default search params should return 12 blogs, pagesCount = 2, total count = 12, items = 10 items', async () => {
      const blogs: any[] = [];

      for (let i = 1; i < 13; i++) {
        blogs.push({
          name: `new blog ${i}`,
          description: `desc ${i}`,
          websiteUrl: `https://google.com`,
        });
      }
      await Promise.all(
        blogs.map(async (blog) => {
          await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(blog)
            .expect(201);
        })
      );

      const result = await request(app).get('/blogs').expect(200);

      expect(result.body.pagesCount).toEqual(2);
      expect(result.body.page).toEqual(1);
      expect(result.body.pageSize).toEqual(10);
      expect(result.body.totalCount).toEqual(12);
      expect(result.body.items.length).toEqual(10);
    });
  });

  describe('POST / - create blog', () => {
    const invalidBlogToCreate = {
      name: '',
      websiteUrl: '',
    };

    it('given invalid blog params (all empty strings) should recieve error object with 3 errors', async () => {
      const response = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(invalidBlogToCreate)
        .expect(400);

      const errorBody = response.body;
      expect(errorBody).toEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'name',
          },
          {
            message: expect.any(String),
            field: 'description',
          },
          {
            message: expect.any(String),
            field: 'websiteUrl',
          },
        ],
      });
    });

    it('given valid blog params should return blog object', async () => {
      const blogToCreate = {
        name: 'new blog',
        description: 'desc',
        websiteUrl: 'https://google.com',
      };

      const response = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);
      const createdBlog = response.body;

      expect(createdBlog).toEqual({
        id: expect.any(String),
        name: 'new blog',
        description: 'desc',
        websiteUrl: 'https://google.com',
        createdAt: expect.any(String),
      });
    });
  });

  describe('GET "/blogs/{id}"  - find blog by ID', () => {
    const blogToCreate = {
      name: 'new blog2',
      description: 'desc2',
      websiteUrl: 'https://yandex.com',
    };

    it('should find blog if id is valid', async () => {
      const blog = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      const result = await request(app).get(`/blogs/${blog.body.id}`).expect(200);

      expect(result.body).toEqual({
        id: blog.body.id,
        name: 'new blog2',
        description: 'desc2',
        websiteUrl: 'https://yandex.com',
        createdAt: expect.any(String),
      });
    });

    it('should NOT find blog with invalid ID', async () => {
      const result = await request(app).get(`/blogs/ffjak`).expect(404);
    });
  });

  describe('POST "/blogs/{blogId}/posts" - create post for specified blog', () => {
    const blogToCreate = {
      name: 'new blog',
      description: 'blog desc',
      websiteUrl: 'https://yandex.com',
    };

    const postToCreate = {
      title: 'post',
      shortDescription: 'post description',
      content: 'post content',
    };

    it('Should NOT create post if user is not authorized', async () => {
      const newBlog = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      await request(app)
        .post(`/blogs/${newBlog.body.id}/posts`)
        .send(postToCreate)
        .expect(401);
    });

    it('Should NOT create post if blog ID is invalid', async () => {
      const fakeObjectId = new ObjectId();
      await request(app)
        .post(`/blogs/${fakeObjectId}/posts`)
        .auth('admin', 'qwerty')
        .send(postToCreate)
        .expect(404);
    });

    it('Should create post for blog', async () => {
      const newBlog = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      const result = await request(app)
        .post(`/blogs/${newBlog.body.id}/posts`)
        .auth('admin', 'qwerty')
        .send(postToCreate)
        .expect(201);

      expect(result.body).toStrictEqual({
        id: expect.any(String),
        title: 'post',
        shortDescription: 'post description',
        content: 'post content',
        blogId: newBlog.body.id,
        blogName: 'new blog',
        createdAt: expect.stringMatching(
          /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
        ),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });
  });

  describe('PUT /blogs/{id} - update existing blog by ID', () => {
    const blogToCreate = {
      name: 'new blog3',
      description: 'desc3',
      websiteUrl: 'https://yandex.com',
    };

    it('Should update blog if blog ID is valid', async () => {
      const result = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      await request(app)
        .put(`/blogs/${result.body.id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          name: 'updated name',
          description: 'updated description',
          websiteUrl: 'https://vk.ru',
        })
        .expect(204);

      const updatedBlog = await request(app).get(`/blogs/${result.body.id}`).expect(200);

      expect(updatedBlog.body.name).toBe('updated name');
      expect(updatedBlog.body.description).toBe('updated description');
      expect(updatedBlog.body.websiteUrl).toBe('https://vk.ru');
    });
  });

  describe('PUT /blogs/{id} - update blog and update related posts', () => {
    const blogToCreate = {
      name: 'new blog4',
      description: 'desc4',
      websiteUrl: 'https://youtube.com',
    };

    const postToCreate = {
      title: 'new post',
      shortDescription: 'post ',
      content: 'https://email.com',
      blogId: null,
    };

    it('Should update posts related to updated blog if blog name was changed', async () => {
      const result = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      postToCreate.blogId = result.body.id;
      const postResult = await request(app)
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(postToCreate)
        .expect(201);

      expect(postResult.body.blogName).toBe('new blog4');

      await request(app)
        .put(`/blogs/${result.body.id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          name: 'updated name',
          description: 'updated description',
          websiteUrl: 'https://vk.ru',
        })
        .expect(204);

      const updatedPost = await request(app).get(`/posts/${postResult.body.id}`).expect(200);
      expect(updatedPost.body.blogName).toBe('updated name');
    });
  });

  describe('DELETE /blogs/{id}  - delete blog by id', () => {
    const blogToCreate = {
      name: 'new blog3',
      description: 'desc3',
      websiteUrl: 'https://yandex.com',
    };

    it('Should delete blog by ID', async () => {
      const result = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);

      const delResult = await request(app)
        .delete(`/blogs/${result.body.id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(204);

      const response = await request(app).get(`/blogs/${result.body.id}`).expect(404);
    });

    it('Should not delete blog if ID is invalid', async () => {
      await request(app)
        .delete('/blogs/1233')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(404);
    });
  });
});
