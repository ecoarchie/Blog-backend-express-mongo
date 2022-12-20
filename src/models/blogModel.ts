import { ObjectId } from 'mongodb';

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDBModel = {
  _id: ObjectId;
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};
