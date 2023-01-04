import { Request, Response } from 'express';
import { usersService } from '../service/user-service';
import { jwtService } from '../application/jwt-service';
import { UserDBModel, UserViewModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';
import { authService } from '../service/auth-service';
import { emailManager } from '../managers/email-manager';

export const loginUserController = async (req: Request, res: Response) => {
  const userPassword = req.body.password;
  const userLoginOrEmail = req.body.loginOrEmail;

  const userId = await usersService.checkCredentials(userLoginOrEmail, userPassword);
  if (userId) {
    const token = await jwtService.createJwt(userId);
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

  const userExists = await usersRepository.findUserByLoginOrEmail(email);
  if (userExists) {
    return res.status(400).send({
      errorsMessages: [
        {
          message: 'User with this email is already registered',
          field: 'email',
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
  const userByEmail: UserDBModel | null = await usersService.findUserByEmail(req.body.email);

  if (userByEmail) {
    try {
      const result = await emailManager.sendEmailConfirmationMessage(userByEmail);
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
};
