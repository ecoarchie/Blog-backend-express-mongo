import { Request, Response } from 'express';
import { CommentViewModel } from '../models/commentModel';
import { commentService } from '../service/comments-service';
import { jwtService } from '../application/jwt-service';

export const getCommentByIdController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const validUserSession = await jwtService.verifyToken(refreshToken);
  const currentUserId = validUserSession!.userId;
  const commentFound: CommentViewModel | null = await commentService.getCommentByIdService(
    req.params.id.toString(),
    currentUserId.toString()
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

export const likeCommentController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const commentId = req.params.commentId;
  const likeStatus = req.body.likeStatus;

  const resStatus = await commentService.likeCommentService(userId, commentId, likeStatus);
  res.sendStatus(resStatus);
};
