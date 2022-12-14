import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import { blogRouter } from './routes/blog-routers';
import { blogsRepository } from './repositories/blogs-repository';
import { postRouter } from './routes/post-routers';
import { postsRepository } from './repositories/posts-repository';

export const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
