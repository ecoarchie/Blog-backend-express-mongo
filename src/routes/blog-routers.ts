import { Request, Response, Router } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { blogsRepository } from '../repositories/blogs-repository';
import {
  blogDescriptionValidation,
  blogNameValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
} from '../middlewares/input-validation-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';

export const blogRouter = Router();

blogRouter.get('/', async (req: Request, res: Response) => {
  const foundBlogs = await blogsRepository.findBlogs();
  res.send(foundBlogs);
});

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
  }
);

blogRouter.get('/:id', async (req: Request, res: Response) => {
  const blogFound: BlogViewModel | null = await blogsRepository.findBlogById(
    req.params.id.toString()
  );
  if (blogFound) {
    res.send(blogFound);
  } else {
    res.sendStatus(404);
  }
});

blogRouter.put(
  '/:id',
  basicAuthMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  async (req: Request, res: Response) => {
    const isBlogUpdated: boolean = await blogsRepository.updateBlogById(
      req.params.id.toString(),
      req.body
    );
    if (isBlogUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

blogRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
  const isBlogDeleted: boolean = await blogsRepository.deleteBlogById(req.params.id.toString());
  if (!isBlogDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
