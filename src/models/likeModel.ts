import { ObjectId, WithId, Document } from 'mongodb';

export interface LikeInputModel {
  likeStatus: 'None' | 'Like' | 'Dislike';
}

export interface LikesInfoModel {
  likesCount: number;
  dislikesCount: number;
}

export interface UsersLikesInfoModel extends LikesInfoModel {
  myStatus: 'None' | 'Like' | 'Dislike';
}

export interface UsersLikesDBModel {
  userId: ObjectId;
  likedComments: ObjectId[];
  dislikedComments: ObjectId[];
  likedPosts: ObjectId[];
  dislikedPosts: ObjectId[];
}
