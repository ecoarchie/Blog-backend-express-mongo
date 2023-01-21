import { ObjectId, WithId, Document } from 'mongodb';

export type LikeStatus = 'None' | 'Like' | 'Dislike';

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
  likedComments: ObjectId[];
  dislikedComments: ObjectId[];
  likedPosts: ObjectId[];
  dislikedPosts: ObjectId[];
}
