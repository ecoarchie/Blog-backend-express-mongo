import { ObjectId } from 'mongodb';
import { UserSessionModel } from '../models/UserSessionModel';
import { userSessionCollection } from '../repositories/db';

export const sessionService = {
  async addSession(
    deviceId: string,
    lastActiveDate: string,
    tokenExpireDate: Date,
    ip: string,
    title: string,
    userId: string
  ): Promise<void> {
    const sessionObj: Omit<UserSessionModel, '_id'> = {
      ip,
      title,
      lastActiveDate,
      deviceId,
      tokenExpireDate,
      userId: new ObjectId(userId),
    };
    const result = await userSessionCollection.insertOne(
      sessionObj as UserSessionModel
    );
  },

  async updateSession(newSession: UserSessionModel) {
    const result = await userSessionCollection.updateOne(
      { _id: newSession._id },
      {
        $set: {
          lastActiveDate: newSession.lastActiveDate,
          tokenExpireDate: newSession.tokenExpireDate,
          ip: newSession.ip,
          title: newSession.title,
        },
      },
      { upsert: true }
    );
  },

  async deleteAllSessions() {
    return userSessionCollection.deleteMany({});
  },
};
