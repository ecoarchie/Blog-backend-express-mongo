import { Request, Response } from 'express';
import { UserViewModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';
import { usersService } from '../service/user-service';
import { setUserQueryOptions } from './utils';

export const getAllUsersController = async (req: Request, res: Response) => {
  const options = setUserQueryOptions(req.query);

  const foundUsers: Array<UserViewModel> = await usersService.findUsers(options);
  const totalCount: number =
    options.searchEmailTerm || options.searchLoginTerm
      ? foundUsers.length
      : await usersService.countAllUsers();
  const pagesCount: number = Math.ceil(totalCount / options.pageSize);

  res.send({
    pagesCount,
    page: options.pageNumber,
    pageSize: options.pageSize,
    totalCount,
    items: foundUsers,
  });
};

export const createNewUserController = async (req: Request, res: Response) => {
  const newUser: UserViewModel = await usersService.createNewUser(req.body);

  res.status(201).send(newUser);
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const isUserDeleted: boolean = await usersRepository.deleteUserById(req.params.id.toString());
  if (!isUserDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
};
