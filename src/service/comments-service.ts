import { inject, injectable } from 'inversify';
import { CommentViewModel } from '../models/commentModel';
import { CommentRepository } from '../repositories/comments-repository';

@injectable()
export class CommentService {
  constructor(@inject(CommentRepository) protected commentRepository: CommentRepository) {}
  async getCommentByIdService(
    commentId: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    return this.commentRepository.getCommentById(commentId, userId);
  }

  async updateCommentByIdService(
    commentId: string,
    userId: string,
    content: string
  ): Promise<{ status: number }> {
    const updateResponse = { status: 0 };
    const comment = await this.commentRepository.getCommentById(commentId, userId);
    let commentOwner;
    if (comment) {
      commentOwner = comment.commentatorInfo.userId;
    } else {
      updateResponse.status = 404;
      return updateResponse;
    }
    if (commentOwner !== userId) {
      updateResponse.status = 403;
      return updateResponse;
    }

    const result = await this.commentRepository.updateCommentById(commentId, content);
    return result ? { status: 204 } : { status: 404 };
  }

  async deleteCommentByIdService(
    userId: string,
    commentId: string
  ): Promise<{ status: number }> {
    const deleteResponse = { status: 0 };

    const comment = await this.commentRepository.getCommentById(commentId, userId);
    let commentOwner;
    if (comment) {
      commentOwner = comment.commentatorInfo.userId;
    } else {
      deleteResponse.status = 404;
      return deleteResponse;
    }
    if (commentOwner !== userId) {
      deleteResponse.status = 403;
      return deleteResponse;
    }
    const result = await this.commentRepository.deleteCommentById(commentId);
    return result ? { status: 204 } : { status: 404 };
  }

  async createCommentService(
    postId: string,
    userId: string,
    userLogin: string,
    content: string
  ): Promise<CommentViewModel> {
    const commentToInsert: CommentViewModel = {
      postId,
      content,
      commentatorInfo: { userId, userLogin },
      createdAt: new Date().toISOString(),
    };

    const createdComment = await this.commentRepository.createComment(commentToInsert);

    return createdComment;
  }

  async likeCommentService(
    userId: string,
    commentId: string,
    likeStatus: string
  ): Promise<number> {
    const foundComment = await this.getCommentByIdService(commentId, userId);
    if (!foundComment) return 404;
    try {
      const likeComment = await this.commentRepository.likeComment(
        userId,
        commentId,
        likeStatus
      );
      return 204;
    } catch (error) {
      console.error(error);
      return 404;
    }
  }
}
