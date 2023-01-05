import { ObjectId } from 'mongodb';
import { UserReqQueryModel } from '../models/reqQueryModel';
import { UserDBModel, UserViewModel } from '../models/userModels';
import { usersCollection } from './db';

export const usersRepository = {
  async deleteAllUsers() {
    return usersCollection.deleteMany({});
  },

  async findUsers(options: UserReqQueryModel): Promise<UserViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;

    const emailLoginTerms = [];
    if (options.searchEmailTerm)
      emailLoginTerms.push({ email: { $regex: options.searchEmailTerm, $options: 'i' } });
    if (options.searchLoginTerm)
      emailLoginTerms.push({ login: { $regex: options.searchLoginTerm, $options: 'i' } });
    const searchTerm =
      !options.searchLoginTerm && !options.searchEmailTerm
        ? {}
        : {
            $or: emailLoginTerms,
          };

    const pipeline = [
      { $match: searchTerm },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.pageSize },
      { $project: { _id: 0 } },
    ];

    const users: Array<UserViewModel> = (await usersCollection.aggregate(pipeline).toArray()).map(
      (user) => ({
        id: user.id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })
    );

    return users;
  },

  async countAllUsers(): Promise<number> {
    return usersCollection.countDocuments();
  },

  async createUser(user: UserDBModel): Promise<UserViewModel> {
    const result = await usersCollection.insertOne(user);
    const newUser: UserViewModel = {
      id: result.insertedId.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };

    return newUser;
  },

  async deleteUserById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },

  async findUserById(id: string): Promise<UserViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const result = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (result) {
      return {
        id: result._id.toString(),
        login: result.login,
        email: result.email,
        createdAt: result.createdAt,
      };
    }
    return result;
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string | { login: string; email: string }
  ): Promise<UserDBModel | null> {
    const login = typeof loginOrEmail === 'string' ? loginOrEmail : loginOrEmail.login;
    const email = typeof loginOrEmail === 'string' ? loginOrEmail : loginOrEmail.email;
    const result = await usersCollection.findOne({
      $or: [{ login: login }, { email: email }],
    });
    return result;
  },

  async findUserByConfirmCode(code: string): Promise<UserDBModel | null> {
    console.log(code);

    const result = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    return result;
  },

  async updateConfirmation(id: string) {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );
    return result.modifiedCount === 1;
  },

  async updateConfirmationCode(id: string, newCode: string) {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'emailConfirmation.confirmationCode': newCode } }
    );
    return result.modifiedCount === 1;
  },
};
