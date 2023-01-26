import { Router } from 'express';
import {
  deleteCommentByIdController,
  getCommentByIdController,
  likeCommentController,
  updateCommentByIdController,
} from '../controllers/comments-controllers';
import {
  LikeBodyValidation,
  commentBodyValidation,
  inputValidatiomMiddleware,
} from '../middlewares/input-validation-middleware';
import { accessTokenValidation, jwtAuthMware } from '../middlewares/jwt-auth-mware';

export const commentRouter = Router();

commentRouter.get('/:id', accessTokenValidation, getCommentByIdController);

commentRouter.put(
  '/:commentId',
  jwtAuthMware,
  commentBodyValidation(),
  inputValidatiomMiddleware,
  updateCommentByIdController
);

commentRouter.delete('/:commentId', jwtAuthMware, deleteCommentByIdController);

commentRouter.put(
  '/:commentId/like-status',
  jwtAuthMware,
  LikeBodyValidation(),
  inputValidatiomMiddleware,
  likeCommentController
);
