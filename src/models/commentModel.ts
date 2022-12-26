import { ObjectId } from 'mongodb';

export type CommentDBModel = {
  _id?: ObjectId | null;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: string;
};

export type CommentViewModel = {
  id?: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export type CommentInputModel = {
  content: string;
};
