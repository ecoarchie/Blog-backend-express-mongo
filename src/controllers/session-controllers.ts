import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtService } from '../application/jwt-service';
import { usersCollection } from '../repositories/db';
import { sessionRepository } from '../repositories/session-repository';

export const getActiveSessionsController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    // console.log('no refresh token');
    return res.sendStatus(401);
  }
  const activeSessions = await sessionRepository.getActiveSessions(refreshToken);
  if (!activeSessions) {
    // console.log('no active sessions');
    return res.sendStatus(401);
  }
  res.send(activeSessions);
};

export const deleteRestSessionsController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  const isValidToken = await jwtService.verifyToken(refreshToken);
  if (!isValidToken) {
    return res.sendStatus(401);
  } else {
    const jwtPayload: JwtPayload = jwt.verify(
      refreshToken,
      process.env.SECRET!
    ) as JwtPayload;
    const result = await sessionRepository.deleteRestSessions(
      jwtPayload.userId,
      jwtPayload.deviceId
    );
    if (result) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  }
};

export const deleteDeviceSessionController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  const isValidToken = await jwtService.verifyToken(refreshToken);
  if (!isValidToken) {
    return res.sendStatus(401);
  } else {
    const deviceIdFromParams = req.params.deviceId;
    const jwtPayload: JwtPayload = jwt.verify(
      refreshToken,
      process.env.SECRET!
    ) as JwtPayload;
    const deviceIdFromToken = jwtPayload.deviceId;
    const resultCode = await sessionRepository.deleteDeviceSession(
      jwtPayload.userId,
      deviceIdFromParams
    );
    res.sendStatus(resultCode);
  }
};
