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
exports.logoutController = exports.refreshTokenController = exports.resendRegEmailController = exports.regConfirmController = exports.registerUserController = exports.getCurrentUserInfoController = exports.loginUserController = void 0;
const uuid_1 = require("uuid");
const user_service_1 = require("../service/user-service");
const jwt_service_1 = require("../application/jwt-service");
const users_repository_1 = require("../repositories/users-repository");
const auth_service_1 = require("../service/auth-service");
const email_manager_1 = require("../managers/email-manager");
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPassword = req.body.password;
    const userLoginOrEmail = req.body.loginOrEmail;
    const userId = yield user_service_1.usersService.checkCredentials(userLoginOrEmail, userPassword);
    if (userId) {
        const token = yield jwt_service_1.jwtService.createJwt(userId);
        const refreshToken = yield jwt_service_1.jwtService.createJwtRefresh(userId);
        yield jwt_service_1.jwtService.addRefreshTokenToDB(refreshToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });
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
const registerUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const userExists = yield users_repository_1.usersRepository.findUserByLoginOrEmail({ login, email });
    if (userExists) {
        const errorField = userExists.login === login ? 'login' : 'email';
        return res.status(400).send({
            errorsMessages: [
                {
                    message: `User with this ${errorField} is already registered`,
                    field: `${errorField}`,
                },
            ],
        });
    }
    else {
        const registeredUser = yield user_service_1.usersService.createNewUser(req.body);
    }
    res.sendStatus(204);
});
exports.registerUserController = registerUserController;
const regConfirmController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (result) {
        res.sendStatus(204);
    }
    else {
        res.status(400).send({
            errorsMessages: [
                {
                    message: 'Confirmation code is incorrect, expired or already been applied',
                    field: 'code',
                },
            ],
        });
    }
});
exports.regConfirmController = regConfirmController;
const resendRegEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userByEmail = yield user_service_1.usersService.findUserByEmail(req.body.email);
    let updateResult = false;
    if (userByEmail && !userByEmail.emailConfirmation.isConfirmed) {
        const newConfirmationCode = (0, uuid_1.v4)();
        updateResult = yield users_repository_1.usersRepository.updateConfirmationCode(userByEmail._id.toString(), newConfirmationCode);
    }
    else {
        return res.status(400).send({
            errorsMessages: [
                {
                    message: "Email is already confirmed or doesn't exist",
                    field: 'email',
                },
            ],
        });
    }
    if (updateResult) {
        userByEmail = (yield user_service_1.usersService.findUserByEmail(req.body.email));
        console.log(userByEmail);
        try {
            const result = yield email_manager_1.emailManager.sendEmailConfirmationMessage(userByEmail);
            res.sendStatus(204);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    }
});
exports.resendRegEmailController = resendRegEmailController;
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const userIdWithValidToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!userIdWithValidToken) {
        return res.sendStatus(401);
    }
    else {
        const newAccessToken = jwt_service_1.jwtService.createJwt(userIdWithValidToken);
        const newRefreshToken = jwt_service_1.jwtService.createJwtRefresh(userIdWithValidToken);
        yield jwt_service_1.jwtService.revokeRefreshToken(refreshToken);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).send({ accessToken: newAccessToken });
    }
});
exports.refreshTokenController = refreshTokenController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const userIdWithValidToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!userIdWithValidToken) {
        return res.sendStatus(401);
    }
    yield jwt_service_1.jwtService.revokeRefreshToken(refreshToken);
    res.sendStatus(204);
});
exports.logoutController = logoutController;
