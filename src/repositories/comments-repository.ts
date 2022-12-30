import { ObjectId } from 'mongodb';
import { CommentDBModel, CommentViewModel } from '../models/commentModel';
import { CommentReqQueryModel } from '../models/reqQueryModel';
import { commentsCollection } from './db';

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
      { $project: { _id: 0 } },
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

  async createComment(commentData: CommentViewModel): Promise<CommentViewModel> {
    const comment: CommentDBModel = {
      postId: new ObjectId(commentData.postId),
      content: commentData.content,
      userId: new ObjectId(commentData.userId),
      userLogin: commentData.userLogin,
      createdAt: commentData.createdAt,
    };

    const result = await commentsCollection.insertOne(comment);

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
    return commentsCollection.deleteMany({});
  },
};
