import { Router } from 'express';
import {
  deleteCommentByIdController,
  getCommentByIdController,
  updateCommentByIdController,
} from '../controllers/comments-controllers';
import {
  commentBodyValidation,
  inputValidatiomMiddleware,
} from '../middlewares/input-validation-middleware';
import { jwtAuthMware } from '../middlewares/jwt-auth-mware';

export const commentRouter = Router();

commentRouter.get('/:id', getCommentByIdController);

commentRouter.put(
  '/:commentId',
  jwtAuthMware,
  commentBodyValidation(),
  inputValidatiomMiddleware,
  updateCommentByIdController
);

commentRouter.delete('/:commentId', jwtAuthMware, deleteCommentByIdController);
