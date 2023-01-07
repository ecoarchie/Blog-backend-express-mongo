import jwt from 'jsonwebtoken';
import { tokensCollection } from '../repositories/db';

export const jwtService = {
  async createJwt(userId: string) {
    const token = jwt.sign({ userId }, process.env.SECRET!, { expiresIn: '10s' });
    return token;
  },

  async createJwtRefresh(userId: string) {
    const token = jwt.sign({ userId }, process.env.SECRET!, { expiresIn: '20s' });
    await this.addRefreshTokenToDB(token);
    return token;
  },

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, process.env.SECRET!);
      console.log('result = ', result);
      return result.userId;
    } catch (error) {
      return null;
    }
  },

  async addRefreshTokenToDB(token: string): Promise<void> {
    const tokenObj = {
      refreshToken: token,
      isValid: true,
    };

    const result = await tokensCollection.insertOne(tokenObj);
  },

  async revokeRefreshToken(token: string): Promise<void> {
    const result = await tokensCollection.findOneAndUpdate(
      { refreshToken: token },
      { $set: { isValid: false } }
    );
  },

  async verifyToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, process.env.SECRET!);
      console.log(result);
      if (result.exp < Date.now() / 1000) {
        console.log('not correct exp date');
        return null;
      }

      const checkToken = await tokensCollection.findOne({ refreshToken: token });
      if (checkToken && checkToken.isValid) {
        console.log('isValid field not correct');
        console.log('CheckToken = ', checkToken);
        return result.userId;
      }

      return null;
    } catch (error) {
      console.log('refresh token verification error');
      return null;
    }
  },
};
