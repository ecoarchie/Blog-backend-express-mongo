import { ObjectId } from 'mongodb';
import { UserReqQueryModel } from '../models/reqQueryModel';
import { passwordRecoveryCodeModel, UserDBModel, UserViewModel } from '../models/userModels';
import { userLikesCollection, usersCollection } from './db';
import { LikeStatus, UsersLikesDBModel } from '../models/likeModel';

export const usersRepository = {
  async deleteAllUsers() {
    return usersCollection.deleteMany({});
  },

  async findUsers(options: UserReqQueryModel): Promise<UserViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;

    const emailLoginTerms = [];
    if (options.searchEmailTerm)
      emailLoginTerms.push({
        email: { $regex: options.searchEmailTerm, $options: 'i' },
      });
    if (options.searchLoginTerm)
      emailLoginTerms.push({
        login: { $regex: options.searchLoginTerm, $options: 'i' },
      });
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

    const users: Array<UserViewModel> = (
      await usersCollection.aggregate(pipeline).toArray()
    ).map((user) => ({
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }));

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
    const result = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
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

  async checkRecoveryCode(recoveryCode: string): Promise<boolean> {
    const user = await usersCollection.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    });
    if (!user) {
      return false;
    }
    if (
      user.passwordRecovery.expirationDate! < new Date() ||
      user.passwordRecovery.isUsed !== false
    ) {
      return false;
    }
    return true;
  },

  async setRecoveryCode(
    userId: ObjectId,
    passwordRecoveryObject: passwordRecoveryCodeModel
  ): Promise<void> {
    await usersCollection.updateOne(
      { _id: userId },
      { $set: { passwordRecovery: passwordRecoveryObject } }
    );
  },

  async updateRecoveryCodeAndPassword(recoveryCode: string, hash: string): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { 'passwordRecovery.recoveryCode': recoveryCode },
      {
        $set: {
          'passwordRecovery.recoveryCode': null,
          'passwordRecovery.expirationDate': null,
          'passwordRecovery.isUsed': null,
          passwordHash: hash,
        },
      }
    );
    return result.matchedCount === 1;
  },

  async checkLikeStatus(userId: string, commentId: string): Promise<LikeStatus> {
    const foundUser = await userLikesCollection.findOne({
      userId: new ObjectId(userId),
    });
    if (!foundUser) {
      await userLikesCollection.insertOne({
        userId: new ObjectId(userId),
        likedComments: [],
        dislikedComments: [],
        likedPosts: [],
        dislikedPosts: [],
      });
    }
    const resLiked = await userLikesCollection.findOne({
      $and: [{ userId: new ObjectId(userId) }, { likedComments: new ObjectId(commentId) }],
    });
    if (resLiked) return 'Like';
    const resDisliked = await userLikesCollection.findOne({
      $and: [{ userId: new ObjectId(userId) }, { dislikedComments: new ObjectId(commentId) }],
    });
    if (resDisliked) return 'Dislike';
    return 'None';
    // let result: 'None' | 'Like' | 'Dislike' = 'None';
    // if (resLiked) result = 'Like';
    // else if (resDisliked) result = 'Dislike';
    // else result = 'None';
    // return result;
  },
};
