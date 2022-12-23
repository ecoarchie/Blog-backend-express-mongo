import { Router } from 'express';
import {
  createPostController,
  deletePostByIdController,
  findPostByIdController,
  getAllPostsController,
  updatePostByIdController,
} from '../controllers/post-controllers';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { isValidBlogId } from '../middlewares/blog-id-custom-validator';
import {
  inputValidatiomMiddleware,
  postBodyValidation,
} from '../middlewares/input-validation-middleware';

export const postRouter = Router();

postRouter.get('/', getAllPostsController);

postRouter.post(
  '/',
  basicAuthMiddleware,
  isValidBlogId,
  postBodyValidation(),
  inputValidatiomMiddleware,
  createPostController
);

postRouter.get('/:id', findPostByIdController);

postRouter.put(
  '/:id',
  basicAuthMiddleware,
  isValidBlogId,
  postBodyValidation(),
  inputValidatiomMiddleware,
  updatePostByIdController
);

postRouter.delete('/:id', basicAuthMiddleware, deletePostByIdController);
