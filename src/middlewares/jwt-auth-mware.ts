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

  if (userId) {
    req.user = await usersService.findUserByIdService(userId);
    return next();
  }

  res.sendStatus(401);
};

export const accessTokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    req.user = null;
    return next();
  }
  const token = authorization.split(' ')[1];

  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    req.user = await usersService.findUserByIdService(userId);
    return next();
  }

  return next();
};
