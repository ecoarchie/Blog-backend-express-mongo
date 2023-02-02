import { ObjectId, WithId, Document } from 'mongodb';

export type LikeStatus = 'None' | 'Like' | 'Dislike';

export type LikeStatusObject = {
  field: string;
  fieldId: string;
};

export interface LikeInputModel {
  likeStatus: LikeStatus;
}

export interface LikesInfoModel {
  likesCount: number;
  dislikesCount: number;
}

export interface UsersLikesInfoModel extends LikesInfoModel {
  myStatus: LikeStatus;
}

export interface UsersLikesDBModel {
  userId: ObjectId;
  likedComments: string[];
  dislikedComments: string[];
  likedPosts: string[];
  dislikedPosts: string[];
}
