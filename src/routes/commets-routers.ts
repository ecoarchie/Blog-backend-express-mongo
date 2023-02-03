import { Router } from 'express';
import { container } from '../composition-root';
import { CommentController } from '../controllers/comments-controllers';
import {
  LikeBodyValidation,
  commentBodyValidation,
  inputValidatiomMiddleware,
} from '../middlewares/input-validation-middleware';
import { accessTokenValidation, jwtAuthMware } from '../middlewares/jwt-auth-mware';

const commentController = container.resolve(CommentController);

export const commentRouter = Router();

commentRouter.get('/:id', accessTokenValidation, commentController.getCommentByIdController);

commentRouter.put(
  '/:commentId',
  jwtAuthMware,
  commentBodyValidation(),
  inputValidatiomMiddleware,
  commentController.updateCommentByIdController
);

commentRouter.delete(
  '/:commentId',
  jwtAuthMware,
  commentController.deleteCommentByIdController
);

commentRouter.put(
  '/:commentId/like-status',
  jwtAuthMware,
  LikeBodyValidation(),
  inputValidatiomMiddleware,
  commentController.likeCommentController
);
