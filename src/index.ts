import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import { blogRouter } from './routes/blog-routers';
import { blogsRepository } from './repositories/blogs-repository';

export const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/blogs', blogRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs();
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
