import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserSessionModel } from '../models/UserSessionModel';
import { userSessionCollection } from '../repositories/db';

export const jwtService = {
  async createJwt(userId: string) {
    const token = jwt.sign({ userId }, process.env.SECRET!, { expiresIn: '10s' });
    return token;
  },

  async createJwtRefresh(userId: string, lastActiveDate: string, deviceId: string) {
    const token = jwt.sign(
      { userId, lastActiveDate, deviceId },
      process.env.SECRET!,
      {
        expiresIn: '20s',
      }
    );
    // console.log('token = ', token);
    return token;
  },

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, process.env.SECRET!);
      return result.userId;
    } catch (error) {
      return null;
    }
  },

  async verifyToken(token: string): Promise<UserSessionModel | null> {
    try {
      const result: any = jwt.verify(token, process.env.SECRET!);
      if (result.exp < Date.now() / 1000) {
        return null;
      }
      const checkToken = await userSessionCollection.findOne({
        $and: [
          { lastActiveDate: result.lastActiveDate },
          { deviceId: result.deviceId },
          { userId: new ObjectId(result.userId) },
        ],
      });
      return checkToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
