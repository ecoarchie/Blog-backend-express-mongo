import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { blogRouter } from './routes/blog-routers';
import { postRouter } from './routes/post-routers';
import { userRouter } from './routes/user-routes';
import { BlogsRepository } from './repositories/blogs-repository';
import { postsRepository } from './repositories/posts-repository';
import { usersRepository } from './repositories/users-repository';
import * as dotenv from 'dotenv';
import { commentRouter } from './routes/commets-routers';
import { authRouter } from './routes/auth-routers';
import { commentRepository } from './repositories/comments-repository';
import { sessionRouter } from './routes/session-routers';
import useragent from 'express-useragent';
import { sessionService } from './application/session-service';

dotenv.config();

export const app = express();
export const port = process.env.PORT;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(useragent.express());
app.use(morgan('combined'));
app.set('trust proxy', true);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/auth', authRouter);
app.use('/security/devices', sessionRouter);

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

const blogsRepository = new BlogsRepository();
app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteAllBlogs();
  await postsRepository.deleteAllPosts();
  await usersRepository.deleteAllUsers();
  await commentRepository.deleteAllComments();
  await sessionService.deleteAllSessions();
  res.sendStatus(204);
  return;
});
