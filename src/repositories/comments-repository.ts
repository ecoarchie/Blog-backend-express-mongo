import { ObjectId } from 'mongodb';
import { CommentDBModel, CommentViewModel } from '../models/commentModel';
import { CommentReqQueryModel } from '../models/reqQueryModel';
import {
  commentLikesCollection,
  commentsCollection,
  userLikesCollection,
} from './db';
import { usersRepository } from './users-repository';

export const commentRepository = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    if (!ObjectId.isValid(id)) return null;

    const commentFound = await commentsCollection.findOne({ _id: new ObjectId(id) });
    let commentView: CommentViewModel | null = null;
    if (commentFound) {
      commentView = {
        id: commentFound._id!.toString(),
        content: commentFound.content,
        userId: commentFound.userId.toString(),
        userLogin: commentFound.userLogin,
        createdAt: commentFound.createdAt,
      };
    }
    return commentView;
  },

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } }
    );
    return result.matchedCount === 1;
  },

  async deleteCommentById(id: string) {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },

  async getCommentsByPostId(
    postId: string,
    options: CommentReqQueryModel
  ): Promise<CommentViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;
    const pipeline = [
      { $match: { postId: new ObjectId(postId) } },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.pageSize },
      { $project: { _id: 0, postId: 0 } },
    ];

    const comments: Array<CommentViewModel> = (
      await commentsCollection.aggregate(pipeline).toArray()
    ).map((comment) => {
      comment.id = comment.id.toString();
      comment.userId = comment.userId.toString();
      return comment;
    }) as Array<CommentViewModel>;
    return comments;
  },

  async countAllCommentsByPostId(postId: string): Promise<number> {
    const commentsCount = await commentsCollection.countDocuments({
      postId: new ObjectId(postId),
    });
    return commentsCount;
  },

  async createComment(commentData: CommentViewModel): Promise<CommentViewModel> {
    const comment: CommentDBModel = {
      postId: new ObjectId(commentData.postId),
      content: commentData.content,
      userId: new ObjectId(commentData.userId),
      userLogin: commentData.userLogin,
      createdAt: commentData.createdAt,
    };

    const result = await commentsCollection.insertOne(comment);
    const commentLikeResult = await commentLikesCollection.insertOne({
      commentId: result.insertedId!,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    });

    const newComment: CommentViewModel = {
      id: result.insertedId!.toString(),
      content: commentData.content,
      userId: commentData.userId,
      userLogin: commentData.userLogin,
      createdAt: commentData.createdAt,
    };

    return newComment;
  },

  async deleteAllComments() {
    await commentLikesCollection.deleteMany({});
    await userLikesCollection.deleteMany({});
    return commentsCollection.deleteMany({});
  },

  async _addToUsersLikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { likedComments: new ObjectId(commentId) } }
    );
  },

  async _removeFromUsersLikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { likedComments: new ObjectId(commentId) } }
    );
  },

  async _addToUsersDislikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { dislikedComments: new ObjectId(commentId) } }
    );
  },

  async _removeFromUsersDislikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { dislikedComments: new ObjectId(commentId) } }
    );
  },

  async likeComment(userId: string, commentId: string, likeStatus: string) {
    const likedStatusBefore = await usersRepository.checkLikeStatus(
      userId,
      commentId
    );
    const likedField =
      likeStatus === 'Like' ? 'likesInfo.likesCount' : 'likesInfo.dislikesCount';
    if (likedStatusBefore === likeStatus) {
      return;
      //below is method when double like/dislike cancels first like/dislike
      // await commentLikesCollection.updateOne(
      //   { commentId: new Object(commentId) },
      //   { $inc: { [likedField]: -1 } }
      // );
    }

    if (likedStatusBefore === 'None') {
      const likedUserField =
        likeStatus === 'Like' ? 'likedComments' : 'dislikedComments';
      await commentLikesCollection.updateOne(
        { commentId: new ObjectId(commentId) },
        { $inc: { [likedField]: 1 } }
      );
      await userLikesCollection.updateOne(
        { userId: new ObjectId(userId) },
        { $push: { [likedUserField]: new ObjectId(commentId) } }
      );
    } else if (likedStatusBefore === 'Like') {
      // so likeStatus === 'Dislike'
      await commentLikesCollection.updateOne(
        { commentId: new ObjectId(commentId) },
        { $inc: { 'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1 } }
      );
      await this._removeFromUsersLikeList(userId, commentId);
      await this._addToUsersDislikeList(userId, commentId);
    } else if (likedStatusBefore === 'Dislike') {
      // so likeStatus === 'Like'
      await commentLikesCollection.updateOne(
        { commentId: new ObjectId(commentId) },
        { $inc: { 'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1 } }
      );
      await this._addToUsersLikeList(userId, commentId);
      await this._removeFromUsersDislikeList(userId, commentId);
    }
  },
};
