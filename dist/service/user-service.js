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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_repository_1 = require("../repositories/users-repository");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_manager_1 = require("../managers/email-manager");
exports.usersService = {
    findUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.findUsers(options);
        });
    },
    findUserByIdService(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.findUserById(userId);
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.findUserByLoginOrEmail(email);
        });
    },
    countAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.countAllUsers();
        });
    },
    createNewUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = userData;
            const hash = yield bcrypt_1.default.hash(password, 1);
            const userToInsert = {
                login,
                passwordHash: hash,
                email,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), { hours: 1, minutes: 10 }),
                    isConfirmed: false,
                },
            };
            const createdUser = yield users_repository_1.usersRepository.createUser(userToInsert);
            try {
                const result = yield email_manager_1.emailManager.sendEmailConfirmationMessage(userToInsert);
            }
            catch (error) {
                console.log("Couldn't send email");
                console.log(error);
                return null;
            }
            return createdUser;
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user || !user.emailConfirmation.isConfirmed) {
                return null;
            }
            const userHashInDB = user.passwordHash;
            const match = yield bcrypt_1.default.compare(password, userHashInDB);
            return match ? user._id.toString() : null;
        });
    },
};
