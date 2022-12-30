import { Router } from 'express';
import {
  createCommentForPostController,
  createPostController,
  deletePostByIdController,
  findPostByIdController,
  getAllPostsController,
  getCommentsForPostController,
  updatePostByIdController,
} from '../controllers/post-controllers';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { isValidBlogId } from '../middlewares/blog-id-custom-validator';
import {
  commentBodyValidation,
  inputValidatiomMiddleware,
  postBodyValidation,
} from '../middlewares/input-validation-middleware';
import { jwtAuthMware } from '../middlewares/jwt-auth-mware';

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

postRouter.get('/:postId/comments', getCommentsForPostController);

postRouter.post(
  '/:postId/comments',
  jwtAuthMware,
  commentBodyValidation(),
  inputValidatiomMiddleware,
  createCommentForPostController
);
