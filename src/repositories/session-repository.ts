import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { jwtService } from '../application/jwt-service';
import { DeviceViewModel } from '../models/UserSessionModel';
import { userSessionCollection } from './db';

export const sessionRepository = {
  async getActiveSessions(refreshToken: string): Promise<DeviceViewModel[] | null> {
    const isValidToken = await jwtService.verifyToken(refreshToken);
    if (!isValidToken) {
      return null;
    } else {
      const jwtPayload = jwt.verify(refreshToken, process.env.SECRET!) as JwtPayload;
      const userId = jwtPayload.userId;
      const result = await userSessionCollection
        .find({ userId: new ObjectId(userId) })
        .toArray();
      return result.map((session) => ({
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId,
      }));
    }
  },

  async deleteRestSessions(userId: string, deviceId: string): Promise<boolean> {
    const result = await userSessionCollection.deleteMany({
      $and: [{ userId: new ObjectId(userId) }, { deviceId: { $ne: deviceId } }],
    });

    return result.acknowledged;
  },

  async deleteDeviceSession(userId: string, deviceId: string): Promise<number> {
    const foundSession = await userSessionCollection.findOne({ deviceId });
    if (!foundSession) {
      return 404;
    }
    if (foundSession.userId.toString() !== userId) {
      return 403;
    } else {
      try {
        await userSessionCollection.deleteOne({ deviceId });
        return 204;
      } catch (error) {
        console.log(error);
        console.log('cannot delete device session');
        return 400;
      }
    }
  },

  async deleteSessionWhenLogout(sessionId: ObjectId): Promise<void> {
    await userSessionCollection.deleteOne({ _id: sessionId });
  },
};
