import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.sendStatus(401);
  }
  const [method, encoded] = authorization.split(' ');
  const decoded = Buffer.from(encoded, 'base64').toString('ascii');

  const [username, password]: Array<string> = decoded.split(':');
  if (method !== 'Basic' || username !== 'admin' || password !== 'qwerty') {
    return res.sendStatus(401);
  } else {
    next();
  }
};
