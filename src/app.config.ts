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
import { usersService } from './service/user-service';

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

  const createdUser = await usersService.createNewUser({
    login: req.body.loginOrEmail,
    password: req.body.password,
    email: 'user@email.com',
  });
  const user = await usersRepository.findUserById(createdUser.id);
  const userHashInDB = user!.passwordHash;

  const match = await bcrypt.compare(userPassword, userHashInDB);
  if (!match && userLoginOrEmail === user!.login) {
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
