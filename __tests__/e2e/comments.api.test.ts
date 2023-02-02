import request from 'supertest';
import { app } from '../../src/app.config';

const validUser = {
  login: 'admin',
  email: 'admin@mail.com',
  password: 'qwerty',
};

const validUser2 = {
  login: 'admin2',
  email: 'admin2@mail.com',
  password: 'qwerty',
};

const blogToCreate = {
  name: 'new blog',
  description: 'desc',
  websiteUrl: 'https://google.com',
};

const postToCreate = {
  title: 'new post',
  shortDescription: 'post description for blog',
  content: 'some post content',
  blogId: null,
};

const userLoginData = {
  loginOrEmail: 'admin',
  password: 'qwerty',
};

const user2LoginData = {
  loginOrEmail: 'admin2',
  password: 'qwerty',
};

describe('Comments routes', () => {
  let postId: string;
  let refreshToken: string;
  let accessToken: string;
  let refreshToken2: string;
  let accessToken2: string;

  beforeAll(async () => {
    await request(app).delete('/testing/all-data');
    const createBlogResponse = await request(app)
      .post('/blogs')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(blogToCreate)
      .expect(201);

    postToCreate.blogId = createBlogResponse.body.id;

    const response = await request(app)
      .post('/posts')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(postToCreate)
      .expect(201);
    const posts = await request(app).get('/posts').expect(200);
    postId = posts.body.items[0].id;

    // create user and user2
    const user = await request(app)
      .post('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(validUser)
      .expect(201);

    const user2 = await request(app)
      .post('/users')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(validUser2)
      .expect(201);

    // login user1
    const result = await request(app).post('/auth/login').send(userLoginData).expect(200);
    expect(result.body).toHaveProperty('accessToken');
    accessToken = result.body.accessToken;
    const refreshTokenString = result.headers['set-cookie'][0].split(' ')[0];
    refreshToken = refreshTokenString.split('=')[1].slice(0, -1);

    // login user2
    const result2 = await request(app).post('/auth/login').send(user2LoginData).expect(200);
    expect(result2.body).toHaveProperty('accessToken');
    accessToken2 = result2.body.accessToken;
    const refreshTokenString2 = result2.headers['set-cookie'][0].split(' ')[0];
    refreshToken2 = refreshTokenString2.split('=')[1].slice(0, -1);
  });

  afterAll(async () => {
    await request(app).delete('/testing/all-data');
  });

  describe('POST "posts/{postId}/comments" - create new comment for specified post', () => {
    it('given post Id create comment from body', async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'stringstringstringst',
        })
        .expect(201);

      expect(comment.body).toStrictEqual({
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'admin',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('given invalid post ID', async () => {
      await request(app)
        .post(`/posts/${postId.slice(-1)}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'stringstringstringst',
        })
        .expect(404);
    });

    it('given invalid input data - comment length less than 20 chars', async () => {
      const result = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'shortStr',
        })
        .expect(400);

      expect(result.body).toStrictEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'content',
          },
        ],
      });
    });
  });

  describe('GET "posts/{postId}/comments" - return comments for specified post', () => {
    it('given valid postId', async () => {
      const result = await request(app).get(`/posts/${postId}/comments`).expect(200);
      expect(result.body).toStrictEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
            id: expect.any(String),
            content: 'stringstringstringst',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'admin',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('given invalid postid', async () => {
      await request(app)
        .get(`/posts/${postId.slice(-1)}/comments`)
        .expect(404);
    });
  });

  describe('GET "comments/{id}" - return comment by id', () => {
    it('given valid comment id', async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'comment 1 with more than 20 chars in it',
        })
        .expect(201);

      const result = await request(app).get(`/comments/${comment.body.id}`).expect(200);
      expect(result.body).toStrictEqual({
        id: expect.any(String),
        content: 'comment 1 with more than 20 chars in it',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'admin',
        },
        createdAt: comment.body.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('given invalid comment id', async () => {
      const result = await request(app).get(`/comments/112233`).expect(404);
    });
  });

  describe('PUT "comments/{commentId}" - update existing comment by Id with new content', () => {
    let commentId: string;
    beforeAll(async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'comment updating comment route larger than 20 chars',
        })
        .expect(201);

      commentId = comment.body.id;
    });

    it('given valid comment Id and valid input', async () => {
      await request(app)
        .put(`/comments/${commentId}`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'UPDATED comment updating comment route larger than 20 chars',
        })
        .expect(204);
    });

    it('given incorrect input value of content field', async () => {
      const updateRes = await request(app)
        .put(`/comments/${commentId}`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: '',
        })
        .expect(400);

      expect(updateRes.body).toStrictEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'content',
          },
        ],
      });
    });

    it('given access without access token', async () => {
      const updateRes = await request(app)
        .put(`/comments/${commentId}`)
        .send({
          content: 'some updated content for comment here',
        })
        .expect(401);
    });

    it('trying to update comments that doesnt belong to user', async () => {
      const updateRes = await request(app)
        .put(`/comments/${commentId}`)
        .set('Cookie', refreshToken2)
        .set('authorization', `Bearer ${accessToken2}`)
        .send({
          content: 'some commets to post that doesnt belong to this user',
        })
        .expect(403);
    });

    it('given invalid commentId', async () => {
      const updateRes = await request(app)
        .put(`/comments/12344`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'some commets to post but commment id is invalid',
        })
        .expect(404);
    });
  });

  describe('DELETE "comments/{commentId}" - delete existing comment by Id', () => {
    let commentId: string;
    beforeAll(async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'comment deleting comment route larger than 20 chars',
        })
        .expect(201);

      commentId = comment.body.id;
    });

    it('given access without access token', async () => {
      const updateRes = await request(app).delete(`/comments/${commentId}`).expect(401);
    });

    it('trying to delete comments that doesnt belong to user', async () => {
      const updateRes = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Cookie', refreshToken2)
        .set('authorization', `Bearer ${accessToken2}`)
        .expect(403);
    });

    it('given invalid commentId', async () => {
      const updateRes = await request(app)
        .delete(`/comments/12344`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('given valid comment Id and valid input', async () => {
      await request(app)
        .delete(`/comments/${commentId}`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });

  describe('PUT "/comments/{commentId}/like-status" - make like/dislike, unlike/undislike operattion', () => {
    const newUsers: any[] = [];
    const usersTokens: any[] = [];
    const results: any[] = [];
    beforeAll(async () => {
      for (let i = 101; i < 104; i++) {
        newUsers.push({
          login: `admin${i}`,
          email: `admin${i}@mail.com`,
          password: `qwerty${i}`,
        });
      }
      // creation of 3 users
      await Promise.all(
        newUsers.map(async (user) => {
          await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(user);
        })
      );

      // login 3 users
      await Promise.all(
        newUsers.map(async (user) => {
          let result = await request(app).post('/auth/login').send({
            loginOrEmail: user.login,
            password: user.password,
          });
          results.push(result);
        })
      );

      // create array of tokens for logged in users
      await Promise.all(
        results.map(async (result) => {
          usersTokens.push({
            accessToken: result.body.accessToken,
            refreshToken: result.headers['set-cookie'][0]
              .split(' ')[0]
              .split('=')[1]
              .slice(0, -1),
          });
        })
      );
    });

    it('should return comment with status "like" and count of likes = 1, after 2 consequtive likes by one user', async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'comment 1111111111111111111111111111111111',
        })
        .expect(201);

      await request(app)
        .put(`/comments/${comment.body.id}/like-status`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);

      await request(app)
        .put(`/comments/${comment.body.id}/like-status`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);

      const result = await request(app)
        .get(`/comments/${comment.body.id}`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(result.body.likesInfo.likesCount).toBe(1);
      expect(result.body.content).toBe('comment 1111111111111111111111111111111111');
      expect(result.body.likesInfo.myStatus).toBe('Like');
    });

    it('should return comment with 1 like and 2 dislikes', async () => {
      const comment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', refreshToken)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
          content: 'comment with more than 20 chars to like/dislike it',
        })
        .expect(201);

      await Promise.all(
        usersTokens.map(async (token, index) => {
          await request(app)
            .put(`/comments/${comment.body.id}/like-status`)
            .set('Cookie', token.refreshToken)
            .set('authorization', `Bearer ${token.accessToken}`)
            .send({
              likeStatus: index === 0 ? 'Like' : 'Dislike',
            })
            .expect(204);
        })
      ).then(async (result) => {
        const getComment = await request(app).get(`/comments/${comment.body.id}`).expect(200);
        expect(getComment.body).toStrictEqual({
          id: getComment.body.id,
          content: 'comment with more than 20 chars to like/dislike it',
          commentatorInfo: {
            userId: expect.any(String),
            userLogin: 'admin',
          },
          createdAt: getComment.body.createdAt,
          likesInfo: {
            likesCount: 1,
            dislikesCount: 2,
            myStatus: 'None',
          },
        });
      });
    });
  });
});
