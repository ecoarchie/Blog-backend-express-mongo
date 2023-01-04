import { UserDBModel } from '../models/userModels';
import { usersRepository } from '../repositories/users-repository';

export const authService = {
  async confirmEmail(code: string) {
    //TODO user should be returned as UserViewModel
    let user: UserDBModel | null = await usersRepository.findUserByConfirmCode(code);
    if (
      !user ||
      user.emailConfirmation.confirmationCode !== code ||
      user.emailConfirmation.expirationDate < new Date() ||
      user.emailConfirmation.isConfirmed
    ) {
      return false;
    }
    let result = await usersRepository.updateConfirmation(user._id!.toString());
    return result;
  },
};
