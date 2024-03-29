import { ObjectId } from 'mongodb';

export type TokenDBModel = {
  _id?: ObjectId;
  refreshToken: string;
  isValid: boolean;
};

export type RefreshTokenModel = {
  userId: string;
  lastActiveDate: string;
  deviceId: string;
  iat: Date;
  exp: Date;
};
