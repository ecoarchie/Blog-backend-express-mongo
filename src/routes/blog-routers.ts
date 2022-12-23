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
import {
  createBlogController,
  createBlogPostController,
  deleteBlogByIdController,
  getAllBlogsController,
  getBlogByIdcontroller,
  getPostsByBlogIdController,
  updateBlogByIdController,
} from '../controllers/blog-controllers';

export const blogRouter = Router();

blogRouter.get('/', getAllBlogsController);

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  createBlogController
);

blogRouter.post(
  '/:blogId/posts',
  basicAuthMiddleware,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  inputValidatiomMiddleware,
  createBlogPostController
);

blogRouter.get('/:id', getBlogByIdcontroller);

blogRouter.put(
  '/:id',
  basicAuthMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  inputValidatiomMiddleware,
  updateBlogByIdController
);

blogRouter.delete('/:id', basicAuthMiddleware, deleteBlogByIdController);

blogRouter.get('/:blogId/posts', getPostsByBlogIdController);
