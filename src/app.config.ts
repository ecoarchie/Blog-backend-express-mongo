import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import { blogRouter } from './routes/blog-routers';
import { blogsRepository } from './repositories/blogs-repository';
import { postRouter } from './routes/post-routers';
import { postsRepository } from './repositories/posts-repository';
import * as dotenv from 'dotenv';

dotenv.config();

export const app = express();
export const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  postsRepository.deleteAllPosts();
  res.sendStatus(204);
});
