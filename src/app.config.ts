import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import { blogRouter } from './routes/blog-routers';
import { postRouter } from './routes/post-routers';
import { userRouter } from './routes/user-routes';
import { blogsRepository } from './repositories/blogs-repository';
import { postsRepository } from './repositories/posts-repository';
import { usersRepository } from './repositories/users-repository';
import * as dotenv from 'dotenv';

dotenv.config();

export const app = express();
export const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  postsRepository.deleteAllPosts();
  usersRepository.deleteAllUsers();
  res.sendStatus(204);
});
