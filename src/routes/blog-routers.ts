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
import { postsRepository } from '../repositories/posts-repository';

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
    res.status(200).send(blogFound);
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

blogRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
  const blog: BlogViewModel | null = await blogsRepository.findBlogById(
    req.params.blogId.toString()
  );

  if (blog) {
    const pageNumber: number = Number(req.query.pageNumber) || 1;
    const pageSize: number = Number(req.query.pageSize) || 10;
    const sortBy: string = req.query.sortBy?.toString() || 'createdAt';
    const sortDirection: 'asc' | 'desc' = (req.query.sortDirection as 'asc' | 'desc') || 'desc';
    const skip: number = (pageNumber - 1) * pageSize;

    const posts: Array<BlogViewModel> = await postsRepository.findPostsByBlogId(
      blog.id.toString(),
      skip,
      pageSize,
      sortBy,
      sortDirection
    );

    const totalCount: number = await postsRepository.countPostsByBlogId(blog.id.toString());
    const pagesCount: number = Math.ceil(totalCount / pageSize);

    res.send({
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    });
  } else {
    res.sendStatus(404);
  }
});
