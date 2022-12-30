import { Router } from 'express';
import {
  blogBodyValidation,
  inputValidatiomMiddleware,
  postBodyValidation,
} from '../middlewares/input-validation-middleware';
import {
  createBlogController,
  createBlogPostController,
  deleteBlogByIdController,
  getAllBlogsController,
  getBlogByIdcontroller,
  getPostsByBlogIdController,
  updateBlogByIdController,
} from '../controllers/blog-controllers';
import { jwtAuthMware } from '../middlewares/jwt-auth-mware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';

export const blogRouter = Router();

blogRouter.get('/', getAllBlogsController);

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogBodyValidation(),
  inputValidatiomMiddleware,
  createBlogController
);

blogRouter.post(
  '/:blogId/posts',
  basicAuthMiddleware,
  postBodyValidation(),
  inputValidatiomMiddleware,
  createBlogPostController
);

blogRouter.get('/:id', getBlogByIdcontroller);

blogRouter.put(
  '/:id',
  basicAuthMiddleware,
  blogBodyValidation(),
  inputValidatiomMiddleware,
  updateBlogByIdController
);

blogRouter.delete('/:id', basicAuthMiddleware, deleteBlogByIdController);

blogRouter.get('/:blogId/posts', getPostsByBlogIdController);
