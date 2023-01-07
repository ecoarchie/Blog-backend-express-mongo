import { ObjectId } from 'mongodb';

export type TokenDBModel = {
  _id?: ObjectId;
  refreshToken: string;
  isValid: boolean;
};
