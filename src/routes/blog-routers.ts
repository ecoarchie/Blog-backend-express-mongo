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

blogRouter.get('/', (req: Request, res: Response) => {
  const foundBlogs = blogsRepository.findBlogs();
  res.send(foundBlogs);
});

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  (req: Request, res: Response) => {
    const newBlog = blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
  }
);

blogRouter.get('/:id', (req: Request, res: Response) => {
  const blogFound: BlogViewModel | undefined = blogsRepository.findBlogById(
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
  (req: Request, res: Response) => {
    const isBlogUpdated: boolean = blogsRepository.updateBlogById(
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

blogRouter.delete('/:id', basicAuthMiddleware, (req: Request, res: Response) => {
  const isBlogDeleted: boolean = blogsRepository.deleteBlogById(req.params.id.toString());
  if (!isBlogDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
