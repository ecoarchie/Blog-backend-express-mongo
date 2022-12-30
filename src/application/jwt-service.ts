require('dotenv').config();
import jwt from 'jsonwebtoken';

export const jwtService = {
  async createJwt(userId: string) {
    const token = jwt.sign({ userId }, process.env.SECRET!, { expiresIn: '10h' });
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
};
