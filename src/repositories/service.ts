import { ReqQueryModel } from '../models/reqQueryModel';

export const setQueryParams = (query: ReqQueryModel) => {
  const searchNameTerm: string | null = query.searchNameTerm || null;
  const pageNumber: number = Number(query.pageNumber) || 1;
  const pageSize: number = Number(query.pageSize) || 10;
  const sortBy: string = query.sortBy?.toString() || 'createdAt';
  const sortDirection: 'asc' | 'desc' = (query.sortDirection as 'asc' | 'desc') || 'desc';
  const skip: number = (pageNumber - 1) * pageSize;

  return { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection, skip };
};
