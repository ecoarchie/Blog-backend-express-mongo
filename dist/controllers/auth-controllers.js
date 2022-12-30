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
exports.getCurrentUserInfoController = exports.loginUserController = void 0;
const user_service_1 = require("../service/user-service");
const jwt_service_1 = require("../application/jwt-service");
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPassword = req.body.password;
    const userLoginOrEmail = req.body.loginOrEmail;
    const userId = yield user_service_1.usersService.checkCredentials(userLoginOrEmail, userPassword);
    if (userId) {
        const token = yield jwt_service_1.jwtService.createJwt(userId);
        res.status(200).send({ accessToken: token });
    }
    else {
        res.sendStatus(401);
    }
});
exports.loginUserController = loginUserController;
const getCurrentUserInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        email: req.user.email,
        login: req.user.login,
        userId: req.user.id,
    });
});
exports.getCurrentUserInfoController = getCurrentUserInfoController;
