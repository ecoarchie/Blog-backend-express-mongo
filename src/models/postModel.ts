import { ObjectId } from 'mongodb';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type BlogPostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};
export type PostViewModel = {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikesModel[];
  };
};

export type PostsPaginationView = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};

export type PostDBModel = {
  _id?: ObjectId | null;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
};

export interface NewestLikesModel {
  addedAt: string;
  userId: string;
  login: string;
}

export interface PostLikesDBModel {
  postId: ObjectId;
  likesCount: number;
  dislikesCount: number;
  myStatus?: string;
  newestLikes: NewestLikesModel[];
}
