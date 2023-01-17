import { ObjectId, WithId } from 'mongodb';

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
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery: passwordRecoveryCodeModel;
};

export type PaginatorUserViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserViewModel>;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type passwordRecoveryCodeModel = {
  recoveryCode: string | null;
  expirationDate: Date | null;
  isUsed: boolean | null;
};
