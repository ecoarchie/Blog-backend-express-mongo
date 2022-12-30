import {
  BlogReqQueryModel,
  CommentReqQueryModel,
  PostReqQueryModel,
  UserReqQueryModel,
} from '../models/reqQueryModel';

export const setBlogQueryParams = (query: BlogReqQueryModel) => {
  const searchNameTerm: string | null = query.searchNameTerm || null;
  const pageNumber: number = Number(query.pageNumber) || 1;
  const pageSize: number = Number(query.pageSize) || 10;
  const sortBy: string = query.sortBy?.toString() || 'createdAt';
  const sortDirection: 'asc' | 'desc' = (query.sortDirection as 'asc' | 'desc') || 'desc';
  const skip: number = (pageNumber - 1) * pageSize;

  return { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection, skip };
};

export const setPostQueryParams = (query: PostReqQueryModel) => {
  const searchNameTerm: string | null = query.searchNameTerm || null;
  const pageNumber: number = Number(query.pageNumber) || 1;
  const pageSize: number = Number(query.pageSize) || 10;
  const sortBy: string = query.sortBy?.toString() || 'createdAt';
  const sortDirection: 'asc' | 'desc' = (query.sortDirection as 'asc' | 'desc') || 'desc';
  const skip: number = (pageNumber - 1) * pageSize;

  return { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection, skip };
};

export const setUserQueryOptions = (query: UserReqQueryModel) => {
  const searchEmailTerm: string | null = query.searchEmailTerm || null;
  const searchLoginTerm: string | null = query.searchLoginTerm || null;
  const pageNumber: number = Number(query.pageNumber) || 1;
  const pageSize: number = Number(query.pageSize) || 10;
  const sortBy: string = query.sortBy?.toString() || 'createdAt';
  const sortDirection: 'asc' | 'desc' = (query.sortDirection as 'asc' | 'desc') || 'desc';
  const skip: number = (pageNumber - 1) * pageSize;

  return { searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection, skip };
};

export const setCommentsQueryParams = (query: CommentReqQueryModel) => {
  const pageNumber: number = Number(query.pageNumber) || 1;
  const pageSize: number = Number(query.pageSize) || 10;
  const sortBy: string = query.sortBy?.toString() || 'createdAt';
  const sortDirection: 'asc' | 'desc' = (query.sortDirection as 'asc' | 'desc') || 'desc';
  const skip: number = (pageNumber - 1) * pageSize;

  return { pageNumber, pageSize, sortBy, sortDirection, skip };
};
