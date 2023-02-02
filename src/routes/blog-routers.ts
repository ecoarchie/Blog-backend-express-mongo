import { Router } from 'express';
import {
  blogBodyValidation,
  inputValidatiomMiddleware,
  postBodyValidation,
} from '../middlewares/input-validation-middleware';
import { BlogsController } from '../controllers/blog-controllers';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { accessTokenValidation } from '../middlewares/jwt-auth-mware';

export const blogRouter = Router();
const blogsController = new BlogsController();

blogRouter.get('/', blogsController.getAllBlogs);

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogBodyValidation(),
  inputValidatiomMiddleware,
  blogsController.createBlog
);

blogRouter.post(
  '/:blogId/posts',
  basicAuthMiddleware,
  postBodyValidation(),
  inputValidatiomMiddleware,
  blogsController.createBlogPost
);

blogRouter.get('/:id', blogsController.getBlogById);

blogRouter.put(
  '/:id',
  basicAuthMiddleware,
  blogBodyValidation(),
  inputValidatiomMiddleware,
  blogsController.updateBlogById
);

blogRouter.delete('/:id', basicAuthMiddleware, blogsController.deleteBlogById);

blogRouter.get('/:blogId/posts', accessTokenValidation, blogsController.getPostsByBlogId);
