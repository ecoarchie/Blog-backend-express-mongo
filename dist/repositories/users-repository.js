"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.usersRepository = {
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.usersCollection.deleteMany({});
        });
    },
    findUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[options.sortBy] = options.sortDirection === 'asc' ? 1 : -1;
            const emailLoginTerms = [];
            if (options.searchEmailTerm)
                emailLoginTerms.push({ email: { $regex: options.searchEmailTerm, $options: 'i' } });
            if (options.searchLoginTerm)
                emailLoginTerms.push({ login: { $regex: options.searchLoginTerm, $options: 'i' } });
            const searchTerm = !options.searchLoginTerm && !options.searchEmailTerm
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
            const users = (yield db_1.usersCollection.aggregate(pipeline).toArray()).map((user) => ({
                id: user.id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
            }));
            return users;
        });
    },
    countAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.usersCollection.countDocuments();
        });
    },
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.insertOne(user);
            const newUser = {
                id: result.insertedId.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
            };
            return newUser;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return false;
            const result = yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return null;
            const result = yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (result) {
                return {
                    id: result._id.toString(),
                    login: result.login,
                    email: result.email,
                    createdAt: result.createdAt,
                };
            }
            return result;
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
            });
            return result;
        });
    },
};
