import { Request, Response, Router } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { blogsRepository } from '../repositories/blogs-repository';
import {
  blogDescriptionValidation,
  blogNameValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../middlewares/input-validation-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { postsRepository } from '../repositories/posts-repository';
import { setQueryParams } from '../repositories/service';
import { PostViewModel } from '../models/postModel';

export const blogRouter = Router();

blogRouter.get('/', async (req: Request, res: Response) => {
  const options = setQueryParams(req.query);

  const foundBlogs = await blogsRepository.findBlogs(options);
  const totalCount: number = options.searchNameTerm
    ? foundBlogs.length
    : await blogsRepository.countAllBlogs();
  const pagesCount: number = Math.ceil(totalCount / options.pageSize);

  res.send({
    pagesCount,
    page: options.pageNumber,
    pageSize: options.pageSize,
    totalCount,
    items: foundBlogs,
  });
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

blogRouter.post(
  '/:blogId/posts',
  basicAuthMiddleware,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  inputValidatiomMiddleware,
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.findBlogById(req.params.blogId.toString());
    if (!blog) {
      res.sendStatus(404);
    } else {
      const postCreated: PostViewModel = await postsRepository.createBlogPost(blog.id, req.body);
      res.status(201).send(postCreated);
    }
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
    const { pageNumber, pageSize, sortBy, sortDirection, skip } = setQueryParams(req.query);

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
