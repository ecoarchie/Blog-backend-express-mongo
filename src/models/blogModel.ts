import { ObjectId } from 'mongodb';

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};

export type BlogDBModel = {
  _id?: ObjectId | null;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};

export type BlogsPaginationView = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};
