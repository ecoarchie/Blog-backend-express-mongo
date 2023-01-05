import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

import { UserReqQueryModel } from '../models/reqQueryModel';
import { UserDBModel, UserInputModel, UserViewModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';
import { emailManager } from '../managers/email-manager';

export const usersService = {
  async findUsers(options: UserReqQueryModel): Promise<UserViewModel[]> {
    return usersRepository.findUsers(options);
  },

  async findUserByIdService(userId: string): Promise<UserViewModel | null> {
    return usersRepository.findUserById(userId);
  },

  async findUserByEmail(email: string): Promise<UserDBModel | null> {
    return usersRepository.findUserByLoginOrEmail(email);
  },

  async countAllUsers(): Promise<number> {
    return usersRepository.countAllUsers();
  },

  async createNewUser(userData: UserInputModel): Promise<UserViewModel | null> {
    const { login, password, email } = userData;
    const hash = await bcrypt.hash(password, 1);

    const userToInsert: UserDBModel = {
      login,
      passwordHash: hash,
      email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 10 }),
        isConfirmed: false,
      },
    };

    const createdUser = await usersRepository.createUser(userToInsert);
    try {
      const result = await emailManager.sendEmailConfirmationMessage(userToInsert);
    } catch (error) {
      console.log("Couldn't send email");
      console.log(error);
      return null;
    }
    return createdUser;
  },

  async createNewAdmin(userData: UserInputModel): Promise<UserViewModel | null> {
    const { login, password, email } = userData;
    const hash = await bcrypt.hash(password, 1);

    const userToInsert: UserDBModel = {
      login,
      passwordHash: hash,
      email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 10 }),
        isConfirmed: true,
      },
    };

    const createdUser = await usersRepository.createUser(userToInsert);
    return createdUser;
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) {
      return null;
    }
    const userHashInDB = user.passwordHash;

    const match = await bcrypt.compare(password, userHashInDB);

    return match ? user._id!.toString() : null;
  },
};
