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
export type PostViewModel = PostInputModel & {
  id?: string;
  blogName: string;
  createdAt: string;
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
