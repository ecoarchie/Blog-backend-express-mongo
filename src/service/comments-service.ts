import { CommentDBModel, CommentViewModel } from '../models/commentModel';
import { commentRepository } from '../repositories/comments-repository';

export const commentService = {
  async getCommentByIdService(id: string): Promise<CommentViewModel | null> {
    return commentRepository.getCommentById(id);
  },

  async updateCommentByIdService(
    commentId: string,
    userId: string,
    content: string
  ): Promise<{ status: number }> {
    const updateResponse = { status: 0 };
    const comment = await commentRepository.getCommentById(commentId);
    let commentOwner;
    if (comment) {
      commentOwner = comment.userId;
    } else {
      updateResponse.status = 404;
      return updateResponse;
    }
    if (commentOwner !== userId) {
      updateResponse.status = 403;
      return updateResponse;
    }

    const result = await commentRepository.updateCommentById(commentId, content);
    return result ? { status: 204 } : { status: 404 };
  },

  async deleteCommentByIdService(userId: string, commentId: string): Promise<{ status: number }> {
    const deleteResponse = { status: 0 };

    const comment = await commentRepository.getCommentById(commentId);
    let commentOwner;
    if (comment) {
      commentOwner = comment.userId;
    } else {
      deleteResponse.status = 404;
      return deleteResponse;
    }
    if (commentOwner !== userId) {
      deleteResponse.status = 403;
      return deleteResponse;
    }

    const result = await commentRepository.deleteCommentById(commentId);
    return result ? { status: 204 } : { status: 404 };
  },

  async createCommentService(
    postId: string,
    userId: string,
    userLogin: string,
    content: string
  ): Promise<CommentViewModel> {
    const commentToInsert: CommentViewModel = {
      postId,
      content,
      userId,
      userLogin,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await commentRepository.createComment(commentToInsert);

    return createdComment;
  },
};
