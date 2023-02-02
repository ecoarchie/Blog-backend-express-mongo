import request from 'supertest';
import { app } from '../../src/app.config';

//TODO fix posts tests according new postViewModel with extendedLikesInfo
describe('posts routes', () => {
  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  afterAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  describe('GET "/" - find all posts', () => {
    it('should return object with default query params, pagesCount = 0, totalCount = 0, items = []', async () => {
      await request(app)
        .get('/posts')
        .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });
  });

  describe('POST "/" - create post', () => {
    const invalidPostToCreate = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };

    it('given invalid post params (all empty strings) should recieve error obkect with 4 errors', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(invalidPostToCreate)
        .expect(400);

      const errorBody = response.body;
      expect(errorBody).toEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'blogId',
          },
          {
            message: expect.any(String),
            field: 'title',
          },
          {
            message: expect.any(String),
            field: 'shortDescription',
          },
          {
            message: expect.any(String),
            field: 'content',
          },
        ],
      });
    });

    it('given valid post params should return post object', async () => {
      const blogToCreate = {
        name: 'new blog',
        description: 'desc',
        websiteUrl: 'https://google.com',
      };

      const createBlogResponse = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);
      const createdBlog = createBlogResponse.body;

      const postToCreate = {
        title: 'new post1',
        shortDescription: 'blog with created date field',
        content: 'https://email.com',
        blogId: `${createdBlog.id}`,
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(postToCreate)
        .expect(201);
      const createdPost = response.body;

      expect(createdPost).toEqual({
        id: expect.any(String),
        title: 'new post1',
        shortDescription: 'blog with created date field',
        content: 'https://email.com',
        blogId: `${createdBlog.id}`,
        blogName: `${createdBlog.name}`,
        createdAt: expect.any(String),
      });
    });
  });

  describe('GET "/posts/{id}"  - find post by ID', () => {
    it('should find post if id is valid', async () => {
      const blogToCreate = {
        name: 'new blog',
        description: 'desc',
        websiteUrl: 'https://google.com',
      };

      const createBlogResponse = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);
      const createdBlog = createBlogResponse.body;

      const postToCreate = {
        title: 'new post1',
        shortDescription: 'blog with created date field',
        content: 'https://email.com',
        blogId: `${createdBlog.id}`,
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(postToCreate)
        .expect(201);
      const createdPost = response.body;

      const postToFind = await request(app).get(`/posts/${createdPost.id}`).expect(200);
      expect(postToFind.body.id).toBe(createdPost.id);
      expect(postToFind.body.title).toBe('new post1');
      expect(postToFind.body.shortDescription).toBe('blog with created date field');
      expect(postToFind.body.content).toBe('https://email.com');
      expect(postToFind.body.extendedLikesInfo).toStrictEqual({
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      });
    });

    it('should NOT find post with invalid ID', async () => {
      const result = await request(app).get(`/posts/ffjak`).expect(404);
    });
  });

  describe('PUT "/posts/{id}" - update existing post by ID', () => {
    it('Should update blog if blog ID is valid', async () => {
      const blogToCreate = {
        name: 'new blog',
        description: 'desc',
        websiteUrl: 'https://google.com',
      };

      const createBlogResponse = await request(app)
        .post('/blogs')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(blogToCreate)
        .expect(201);
      const createdBlog = createBlogResponse.body;

      const postToUpdate = {
        title: 'new post1',
        shortDescription: 'blog with created date field',
        content: 'https://email.com',
        blogId: `${createdBlog.id}`,
      };

      const result = await request(app)
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(postToUpdate)
        .expect(201);

      const res = await request(app)
        .put(`/posts/${result.body.id}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          title: 'updated new post1',
          shortDescription: 'updated desc',
          content: 'https://email.net',
          blogId: `${createdBlog.id}`,
        })
        .expect(204);

      const updatedPost = await request(app).get(`/posts/${result.body.id}`).expect(200);

      expect(updatedPost.body.title).toBe('updated new post1');
      expect(updatedPost.body.shortDescription).toBe('updated desc');
      expect(updatedPost.body.content).toBe('https://email.net');
      expect(updatedPost.body.blogId).toBe(`${createdBlog.id}`);
    });
  });

  describe('DELETE "/blogs/{id}"  - delete blog by id', () => {
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
