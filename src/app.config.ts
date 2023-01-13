import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { blogRouter } from './routes/blog-routers';
import { postRouter } from './routes/post-routers';
import { userRouter } from './routes/user-routes';
import { blogsRepository } from './repositories/blogs-repository';
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

app.use(bodyParser.json());
app.use(useragent.express());
app.use(cookieParser());
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/auth', authRouter);
app.use('/security/devices', sessionRouter);

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  postsRepository.deleteAllPosts();
  usersRepository.deleteAllUsers();
  commentRepository.deleteAllComments();
  sessionService.deleteAllSessions();
  res.sendStatus(204);
});
