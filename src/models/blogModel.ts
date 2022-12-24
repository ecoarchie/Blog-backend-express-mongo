import { ObjectId } from 'mongodb';

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = BlogInputModel & {
  id?: string;
  createdAt: string;
};

export type BlogDBModel = BlogInputModel & {
  _id?: ObjectId | null;
  createdAt: string;
};
