import { ObjectId } from 'mongodb';
import { LikesInfoModel } from './likeModel';

export interface CommentDBModel {
  _id?: ObjectId | null;
  postId: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: string;
}

export interface CommentViewModel {
  id?: string;
  postId?: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
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
