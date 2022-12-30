export type BlogReqQueryModel = {
  searchNameTerm?: string | null;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  skip?: number;
};

export type PostReqQueryModel = {
  searchNameTerm?: string | null;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  skip?: number;
};

export type UserReqQueryModel = {
  searchEmailTerm?: string | null;
  searchLoginTerm?: string | null;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  skip?: number;
};

export type CommentReqQueryModel = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  skip?: number;
};
