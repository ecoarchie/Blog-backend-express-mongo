import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CommentViewModel } from '../models/commentModel';
import { CommentService } from '../service/comments-service';

@injectable()
export class CommentController {
  constructor(@inject(CommentService) protected commentService: CommentService) {}
  getCommentByIdController = async (req: Request, res: Response) => {
    let currentUserId = req.user?.id || '';
    const commentFound: CommentViewModel | null =
      await this.commentService.getCommentByIdService(
        req.params.id.toString(),
        currentUserId.toString()
      );
    if (commentFound) {
      res.status(200).send(commentFound);
    } else {
      res.sendStatus(404);
    }
  };

  updateCommentByIdController = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const content = req.body.content.toString();
    const updateResult = await this.commentService.updateCommentByIdService(
      req.params.commentId.toString(),
      userId,
      content
    );
    res.sendStatus(updateResult.status);
  };

  deleteCommentByIdController = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const deleteResult = await this.commentService.deleteCommentByIdService(
      userId,
      req.params.commentId.toString()
    );
    res.sendStatus(deleteResult.status);
  };

  likeCommentController = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const commentId = req.params.commentId;
    const likeStatus = req.body.likeStatus;

    const resStatus = await this.commentService.likeCommentService(
      userId,
      commentId,
      likeStatus
    );
    res.sendStatus(resStatus);
  };
}
