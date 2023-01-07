import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { usersService } from '../service/user-service';
import { jwtService } from '../application/jwt-service';
import { UserDBModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';
import { authService } from '../service/auth-service';
import { emailManager } from '../managers/email-manager';
import { tokensCollection } from '../repositories/db';

export const loginUserController = async (req: Request, res: Response) => {
  const userPassword = req.body.password;
  const userLoginOrEmail = req.body.loginOrEmail;

  const userId = await usersService.checkCredentials(userLoginOrEmail, userPassword);
  if (userId) {
    const token = await jwtService.createJwt(userId);
    const refreshToken = await jwtService.createJwtRefresh(userId);
    await jwtService.addRefreshTokenToDB(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
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
  let userByEmail: UserDBModel | null = await usersService.findUserByEmail(req.body.email);

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
    userByEmail = (await usersService.findUserByEmail(req.body.email)) as UserDBModel;
    console.log(userByEmail);
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
    console.log('refresh token is no in cookie');
    return res.sendStatus(401);
  }
  const userIdWithValidToken = await jwtService.verifyToken(refreshToken);
  if (!userIdWithValidToken) {
    console.log('refresh token not verified');
    return res.sendStatus(401);
  } else {
    const newAccessToken = await jwtService.createJwt(userIdWithValidToken);
    const newRefreshToken = await jwtService.createJwtRefresh(userIdWithValidToken);
    await jwtService.revokeRefreshToken(refreshToken);

    console.log('userWithValidToken = ', userIdWithValidToken);
    console.log('new access token = ', newAccessToken);
    console.log('new refresh token = ', newRefreshToken);

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
  const userIdWithValidToken = await jwtService.verifyToken(refreshToken);
  if (!userIdWithValidToken) {
    return res.sendStatus(401);
  }

  await jwtService.revokeRefreshToken(refreshToken);
  res.sendStatus(204);
};
