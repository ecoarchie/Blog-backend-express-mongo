import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { blogRouter } from './routes/blog-routers';
import { postRouter } from './routes/post-routers';
import { userRouter } from './routes/user-routes';
import { blogsRepository } from './repositories/blogs-repository';
import { postsRepository } from './repositories/posts-repository';
import { usersRepository } from './repositories/users-repository';
import * as dotenv from 'dotenv';
import { usersCollection } from './repositories/db';

dotenv.config();

export const app = express();
export const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const userPassword = req.body.password;
  const userLoginOrEmail = req.body.loginOrEmail;

  const userPasswordInDB = 'qwerty1';
  const userLoginInDB = 'lg-465115';

  const hash = await bcrypt.hash(userPassword, 1);

  const match = await bcrypt.compare(userPasswordInDB, hash);
  if (match && userLoginOrEmail === userLoginInDB) {
    res.sendStatus(204);
  } else {
    res.sendStatus(401);
  }
});

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  postsRepository.deleteAllPosts();
  usersRepository.deleteAllUsers();
  res.sendStatus(204);
});
