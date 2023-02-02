import { Router } from 'express';
import { postsController } from '../controllers/post-controllers';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { isValidBlogId } from '../middlewares/blog-id-custom-validator';
import {
  LikeBodyValidation,
  commentBodyValidation,
  inputValidatiomMiddleware,
  postBodyValidation,
} from '../middlewares/input-validation-middleware';
import { accessTokenValidation, jwtAuthMware } from '../middlewares/jwt-auth-mware';

export const postRouter = Router();

postRouter.get('/', accessTokenValidation, postsController.getAllPostsController);

postRouter.post(
  '/',
  basicAuthMiddleware,
  isValidBlogId,
  postBodyValidation(),
  inputValidatiomMiddleware,
  postsController.createPostController
);

postRouter.get('/:id', accessTokenValidation, postsController.getPostByIdController);

postRouter.put(
  '/:id',
  basicAuthMiddleware,
  isValidBlogId,
  postBodyValidation(),
  inputValidatiomMiddleware,
  postsController.updatePostByIdController
);

postRouter.delete('/:id', basicAuthMiddleware, postsController.deletePostByIdController);

postRouter.get(
  '/:postId/comments',
  accessTokenValidation,
  postsController.getCommentsForPostController
);

postRouter.post(
  '/:postId/comments',
  jwtAuthMware,
  commentBodyValidation(),
  inputValidatiomMiddleware,
  postsController.createCommentForPostController
);

postRouter.put(
  '/:postId/like-status',
  jwtAuthMware,
  LikeBodyValidation(),
  inputValidatiomMiddleware,
  postsController.likePostController
);
