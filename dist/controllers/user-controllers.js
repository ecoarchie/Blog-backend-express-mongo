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
exports.deleteUserByIdController = exports.createNewAdminController = exports.createNewUserController = exports.getAllUsersController = void 0;
const users_repository_1 = require("../repositories/users-repository");
const user_service_1 = require("../service/user-service");
const utils_1 = require("./utils");
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, utils_1.setUserQueryOptions)(req.query);
    const foundUsers = yield user_service_1.usersService.findUsers(options);
    const totalCount = options.searchEmailTerm || options.searchLoginTerm
        ? foundUsers.length
        : yield user_service_1.usersService.countAllUsers();
    const pagesCount = Math.ceil(totalCount / options.pageSize);
    res.send({
        pagesCount,
        page: options.pageNumber,
        pageSize: options.pageSize,
        totalCount,
        items: foundUsers,
    });
});
exports.getAllUsersController = getAllUsersController;
const createNewUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_service_1.usersService.createNewUser(req.body);
    if (newUser) {
        res.status(201).send(newUser);
    }
    else {
        res.sendStatus(400); // email wasn't send
    }
});
exports.createNewUserController = createNewUserController;
const createNewAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_service_1.usersService.createNewUser(req.body);
    if (newUser) {
        res.status(201).send(newUser);
    }
    else {
        res.sendStatus(400); // user creation in db error
    }
});
exports.createNewAdminController = createNewAdminController;
const deleteUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserDeleted = yield users_repository_1.usersRepository.deleteUserById(req.params.id.toString());
    if (!isUserDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.deleteUserByIdController = deleteUserByIdController;
