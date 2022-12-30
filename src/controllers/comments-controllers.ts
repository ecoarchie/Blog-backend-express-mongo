import { Request, Response } from 'express';
import { CommentViewModel } from '../models/commentModel';
import { commentService } from '../service/comments-service';

export const getCommentByIdController = async (req: Request, res: Response) => {
  const commentFound: CommentViewModel | null = await commentService.getCommentByIdService(
    req.params.id.toString()
  );
  if (commentFound) {
    res.status(200).send(commentFound);
  } else {
    res.sendStatus(404);
  }
};

export const updateCommentByIdController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const content = req.body.content.toString();
  const updateResult = await commentService.updateCommentByIdService(
    req.params.commentId.toString(),
    userId,
    content
  );
  res.sendStatus(updateResult.status);
};

export const deleteCommentByIdController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const deleteResult = await commentService.deleteCommentByIdService(
    userId,
    req.params.commentId.toString()
  );
  res.sendStatus(deleteResult.status);
};
