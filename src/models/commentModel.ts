import { ObjectId } from 'mongodb';
import { LikesInfoModel } from './likeModel';

export interface CommentDBModel {
  _id?: ObjectId | null;
  postId: ObjectId;
  content: string;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: string;
}

export interface CommentViewModel {
  id?: string;
  postId?: string;
  content: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus?: string;
  };
}

export interface CommentInputModel {
  content: string;
}

export interface CommentLikesDBModel {
  commentId: ObjectId;
  likesInfo: LikesInfoModel;
}
