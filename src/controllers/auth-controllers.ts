import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { usersService } from '../service/user-service';
import { jwtService } from '../application/jwt-service';
import { UserDBModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';
import { authService } from '../service/auth-service';
import { emailManager } from '../managers/email-manager';
import { sessionService } from '../application/session-service';
import { UserSessionModel } from '../models/UserSessionModel';
import { sessionRepository } from '../repositories/session-repository';

export const loginUserController = async (req: Request, res: Response) => {
  const userPassword = req.body.password;
  const userLoginOrEmail = req.body.loginOrEmail;

  const userId = await usersService.checkCredentials(userLoginOrEmail, userPassword);
  // console.log('user id when login', userId);
  if (userId) {
    const token = await jwtService.createJwt(userId);
    const lastActiveDate = new Date().toISOString();
    const deviceId = uuidv4();
    const refreshToken = await jwtService.createJwtRefresh(
      userId,
      lastActiveDate,
      deviceId
    );

    const title = req.useragent?.source;
    const ip = req.ip;
    const tokenRes: any = jwt.verify(refreshToken, process.env.SECRET!);
    const tokenExpireDate = tokenRes.exp;
    await sessionService.addSession(
      deviceId,
      lastActiveDate,
      tokenExpireDate,
      ip,
      title!,
      userId
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, //TODO why not working with true option
    });
    res.status(200).send({ accessToken: token });
  } else {
    res.sendStatus(401);
  }
};

export const getCurrentUserInfoController = async (req: Request, res: Response) => {
  res.status(200).send({
    email: req.user!.email,
    login: req.user!.login,
    userId: req.user!.id,
  });
};

export const registerUserController = async (req: Request, res: Response) => {
  const { login, password, email } = req.body;

  const userExists = await usersRepository.findUserByLoginOrEmail({ login, email });
  if (userExists) {
    const errorField = userExists.login === login ? 'login' : 'email';
    return res.status(400).send({
      errorsMessages: [
        {
          message: `User with this ${errorField} is already registered`,
          field: `${errorField}`,
        },
      ],
    });
  } else {
    const registeredUser = await usersService.createNewUser(req.body);
  }

  res.sendStatus(204);
};

export const regConfirmController = async (req: Request, res: Response) => {
  const result = await authService.confirmEmail(req.body.code);
  if (result) {
    res.sendStatus(204);
  } else {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'Confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ],
    });
  }
};

export const resendRegEmailController = async (req: Request, res: Response) => {
  let userByEmail: UserDBModel | null = await usersService.findUserByEmail(
    req.body.email
  );

  let updateResult: boolean = false;
  if (userByEmail && !userByEmail.emailConfirmation.isConfirmed) {
    const newConfirmationCode = uuidv4();
    updateResult = await usersRepository.updateConfirmationCode(
      userByEmail._id!.toString(),
      newConfirmationCode
    );
  } else {
    return res.status(400).send({
      errorsMessages: [
        {
          message: "Email is already confirmed or doesn't exist",
          field: 'email',
        },
      ],
    });
  }

  if (updateResult) {
    userByEmail = (await usersService.findUserByEmail(
      req.body.email
    )) as UserDBModel;
    try {
      const result = await emailManager.sendEmailConfirmationMessage(userByEmail);
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  const validUserSession = await jwtService.verifyToken(refreshToken);
  if (!validUserSession) {
    return res.sendStatus(401);
  } else {
    const newAccessToken = await jwtService.createJwt(
      validUserSession.userId.toString()
    );
    const newActiveDate = new Date().toISOString();
    const newRefreshToken = await jwtService.createJwtRefresh(
      validUserSession.userId.toString(),
      newActiveDate,
      validUserSession.deviceId
    );
    const tokenExpireDate: any = jwt.verify(newRefreshToken, process.env.SECRET!);
    // console.log('token nn ', tokenExpireDate);
    const newSession: UserSessionModel = {
      ...validUserSession,
      ip: req.header('x-forwarded-for') || (req.socket.remoteAddress as string),
      title: req.useragent?.source as string,
      lastActiveDate: newActiveDate,
      tokenExpireDate: tokenExpireDate.exp,
    };
    await sessionService.updateSession(newSession);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).send({ accessToken: newAccessToken });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  const validUserSession = await jwtService.verifyToken(refreshToken);
  if (!validUserSession) {
    return res.sendStatus(401);
  }

  await sessionRepository.deleteSessionWhenLogout(validUserSession._id);
  res.sendStatus(204);
};
