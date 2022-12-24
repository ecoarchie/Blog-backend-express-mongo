import { UserReqQueryModel } from '../models/reqQueryModel';
import { UserDBModel, UserInputModel, UserViewModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';

import bcrypt from 'bcrypt';

export const usersService = {
  async findUsers(options: UserReqQueryModel): Promise<UserViewModel[]> {
    return usersRepository.findUsers(options);
  },

  async countAllUsers(): Promise<number> {
    return usersRepository.countAllUsers();
  },

  async createNewUser(userData: UserInputModel): Promise<UserViewModel> {
    const { login, password, email } = userData;
    const hash = await bcrypt.hash(password, 1);

    const userToInsert: UserDBModel = {
      login,
      passwordHash: hash,
      email,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await usersRepository.createUser(userToInsert);
    return createdUser;
  },
};
