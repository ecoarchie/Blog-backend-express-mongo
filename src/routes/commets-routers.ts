import { Router } from 'express';

export const commentRouter = Router();

commentRouter.get('/:id', getCommentByIdController);

commentRouter.put('/:commentId', updateCommentByIdController);

commentRouter.delete('/:commentId', deleteCommentByIdController);
