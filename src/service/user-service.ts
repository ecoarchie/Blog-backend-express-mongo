import { UserReqQueryModel } from '../models/reqQueryModel';
import { UserDBModel, UserInputModel, UserViewModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';

import bcrypt from 'bcrypt';

export const usersService = {
  async findUsers(options: UserReqQueryModel): Promise<UserViewModel[]> {
    return usersRepository.findUsers(options);
  },

  async findUserByIdService(userId: string): Promise<UserViewModel | null> {
    return usersRepository.findUserById(userId);
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

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const userHashInDB = user.passwordHash;

    const match = await bcrypt.compare(password, userHashInDB);
    return match ? user._id!.toString() : null;
  },
};
