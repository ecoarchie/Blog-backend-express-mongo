import { ObjectId } from 'mongodb';

export type CommentDBModel = {
  _id?: ObjectId | null;
  postId: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: string;
};

export type CommentViewModel = {
  id?: string;
  postId?: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export type CommentInputModel = {
  content: string;
};
