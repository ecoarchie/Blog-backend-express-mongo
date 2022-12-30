import { Request, Response } from 'express';
import { usersService } from '../service/user-service';
import { jwtService } from '../application/jwt-service';
import { MeViewModel } from '../models/userModels';

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
