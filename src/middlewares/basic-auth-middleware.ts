import { Request, Response, NextFunction } from 'express';

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.sendStatus(401);
  }
  const encoded = authorization.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('ascii');
  const [username, password]: Array<string> = decoded.split(':');
  if (username !== 'admin' || password !== 'qwerty') {
    return res.sendStatus(401);
  } else {
    next();
  }
};
