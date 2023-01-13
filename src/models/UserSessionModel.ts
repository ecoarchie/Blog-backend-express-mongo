import { ObjectId } from 'mongodb';

export type UserSessionModel = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  tokenExpireDate: Date;
  userId: ObjectId;
};

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
