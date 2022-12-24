import { ObjectId } from 'mongodb';

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDBModel = {
  _id?: ObjectId;
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
};

export type PaginatorUserViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserViewModel>;
};
