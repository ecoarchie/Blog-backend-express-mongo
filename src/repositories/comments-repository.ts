import { ObjectId, Document } from 'mongodb';
import { CommentDBModel, CommentViewModel } from '../models/commentModel';
import { CommentReqQueryModel } from '../models/reqQueryModel';
import { commentLikesCollection, commentsCollection, userLikesCollection } from './db';
import { usersRepository } from './users-repository';

export const commentRepository = {
  async getCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    if (!ObjectId.isValid(commentId)) return null;

    const commentFound = await commentsCollection.findOne({ _id: new ObjectId(commentId) });
    let commentView: CommentViewModel | null = null;
    if (commentFound) {
      const likesInfo = await commentLikesCollection.findOne({
        commentId: new ObjectId(commentId),
      });
      let userLikesDislikes;
      if (!userId) {
        console.log('🚀 ~ file: comments-repository.ts:19 ~ getCommentById ~ userId', userId);
        userLikesDislikes = null;
      } else {
        userLikesDislikes = await userLikesCollection.findOne({
          userId: new ObjectId(userId),
        });
        console.log(
          '🚀 ~ file: comments-repository.ts:24 ~ getCommentById ~ userLikesDislikes',
          userLikesDislikes
        );
      }
      let myStatus;
      if (
        !userLikesDislikes?.likedComments.includes(commentId) &&
        !userLikesDislikes?.dislikedComments.includes(commentId)
      ) {
        myStatus = 'None';
      } else {
        if (userLikesDislikes!.likedComments.includes(commentId)) {
          myStatus = 'Like';
        } else if (userLikesDislikes!.dislikedComments.includes(commentId)) {
          myStatus = 'Dislike';
        } else {
          myStatus = 'None';
        }
      }

      commentView = {
        id: commentFound._id!.toString(),
        content: commentFound.content,
        createdAt: commentFound.createdAt,
        likesInfo: { ...likesInfo!.likesInfo, myStatus: myStatus },
        commentatorInfo: {
          userId: commentFound.userId.toString(),
          userLogin: commentFound.userLogin,
        },
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
    //TODO delete comment mentions from all users likes, also delete comment likes

    return result.deletedCount === 1;
  },

  async getCommentsByPostId(
    postId: string,
    options: CommentReqQueryModel
  ): Promise<Document[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;
    const pipeline = [
      { $match: { postId: new ObjectId(postId) } },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.pageSize },
      {
        $lookup: {
          from: 'commentLikes',
          localField: '_id',
          foreignField: 'commentId',
          as: 'likesInfo',
        },
      },
      { $project: { _id: 0, postId: 0, 'likesInfo._id': 0, 'likesInfo.commentId': 0 } },
    ];

    const comments = (await commentsCollection.aggregate(pipeline).toArray()).map(
      (comment) => {
        comment.id = comment.id.toString();
        comment.userId = comment.userId.toString();
        comment.likesInfo = comment.likesInfo[0]?.likesInfo || {
          likesCount: 0,
          dislikesCount: 0,
        };
        return comment;
      }
    );
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
      userId: new ObjectId(commentData.commentatorInfo.userId),
      userLogin: commentData.commentatorInfo.userLogin,
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
      commentatorInfo: {
        userId: commentData.commentatorInfo.userId,
        userLogin: commentData.commentatorInfo.userLogin,
      },
      createdAt: commentData.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };

    return newComment;
  },

  async deleteAllComments() {
    await commentLikesCollection.deleteMany({});
    //TODO now it deletes whole userLikes collection, along with posts likes. Rewrite
    await userLikesCollection.deleteMany({});
    return commentsCollection.deleteMany({});
  },

  async _addToUsersLikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { likedComments: commentId } }
    );
  },

  async _removeFromUsersLikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { likedComments: commentId } }
    );
  },

  async _addToUsersDislikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { dislikedComments: commentId } }
    );
  },

  async _removeFromUsersDislikeList(userId: string, commentId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { dislikedComments: commentId } }
    );
  },

  async likeComment(userId: string, commentId: string, likeStatus: string) {
    const likedStatusBefore = await usersRepository.checkLikeStatus(userId, commentId);
    if (likeStatus === 'None') {
      if (likedStatusBefore === 'Like') {
        await commentLikesCollection.updateOne(
          { commentId: new ObjectId(commentId) },
          { $inc: { 'likesInfo.likesCount': -1 } }
        );
        await this._removeFromUsersLikeList(userId, commentId);
      } else if (likedStatusBefore === 'Dislike') {
        await commentLikesCollection.updateOne(
          { commentId: new ObjectId(commentId) },
          { $inc: { 'likesInfo.dislikesCount': -1 } }
        );
        await this._removeFromUsersDislikeList(userId, commentId);
      }
      return;
    }
    const likedField =
      likeStatus === 'Like' ? 'likesInfo.likesCount' : 'likesInfo.dislikesCount';
    if (likedStatusBefore === likeStatus) {
      return;
      //below is method when double like/dislike cancels first like/dislike.
      // await commentLikesCollection.updateOne(
      //   { commentId: new Object(commentId) },
      //   { $inc: { [likedField]: -1 } }
      // );
    }

    if (likedStatusBefore === 'None') {
      const likedUserField = likeStatus === 'Like' ? 'likedComments' : 'dislikedComments';
      await commentLikesCollection.updateOne(
        { commentId: new ObjectId(commentId) },
        { $inc: { [likedField]: 1 } }
      );
      await userLikesCollection.updateOne(
        { userId: new ObjectId(userId) },
        { $push: { [likedUserField]: commentId } }
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
