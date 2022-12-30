import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { jwtService } from '../application/jwt-service';
import { usersService } from '../service/user-service';

dotenv.config();

export const jwtAuthMware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.sendStatus(401);
  }
  const token = authorization.split(' ')[1];

  const userId = await jwtService.getUserIdByToken(token);
  console.log(userId);

  if (userId) {
    req.user = await usersService.findUserByIdService(userId);
    return next();
  }
  console.log('NOT HERE');

  res.sendStatus(401);
};
