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
exports.confirmPasswordController = exports.passwordRecoveryController = exports.logoutController = exports.refreshTokenController = exports.resendRegEmailController = exports.regConfirmController = exports.registerUserController = exports.getCurrentUserInfoController = exports.loginUserController = void 0;
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const add_1 = __importDefault(require("date-fns/add"));
const user_service_1 = require("../service/user-service");
const jwt_service_1 = require("../application/jwt-service");
const users_repository_1 = require("../repositories/users-repository");
const auth_service_1 = require("../service/auth-service");
const email_manager_1 = require("../managers/email-manager");
const session_service_1 = require("../application/session-service");
const session_repository_1 = require("../repositories/session-repository");
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userPassword = req.body.password;
    const userLoginOrEmail = req.body.loginOrEmail;
    const userId = yield user_service_1.usersService.checkCredentials(userLoginOrEmail, userPassword);
    // console.log('user id when login', userId);
    if (userId) {
        const token = yield jwt_service_1.jwtService.createJwt(userId);
        const lastActiveDate = new Date().toISOString();
        const deviceId = (0, uuid_1.v4)();
        const refreshToken = yield jwt_service_1.jwtService.createJwtRefresh(userId, lastActiveDate, deviceId);
        const title = (_a = req.useragent) === null || _a === void 0 ? void 0 : _a.source;
        const ip = req.ip;
        const tokenRes = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET);
        const tokenExpireDate = tokenRes.exp;
        yield session_service_1.sessionService.addSession(deviceId, lastActiveDate, tokenExpireDate, ip, title, userId);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, //TODO why not working with true option
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
    var _b, _c;
    const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const validUserSession = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!validUserSession) {
        return res.sendStatus(401);
    }
    else {
        const newAccessToken = yield jwt_service_1.jwtService.createJwt(validUserSession.userId.toString());
        const newActiveDate = new Date().toISOString();
        const newRefreshToken = yield jwt_service_1.jwtService.createJwtRefresh(validUserSession.userId.toString(), newActiveDate, validUserSession.deviceId);
        const tokenExpireDate = jsonwebtoken_1.default.verify(newRefreshToken, process.env.SECRET);
        // console.log('token nn ', tokenExpireDate);
        const newSession = Object.assign(Object.assign({}, validUserSession), { ip: req.header('x-forwarded-for') || req.socket.remoteAddress, title: (_c = req.useragent) === null || _c === void 0 ? void 0 : _c.source, lastActiveDate: newActiveDate, tokenExpireDate: tokenExpireDate.exp });
        yield session_service_1.sessionService.updateSession(newSession);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).send({ accessToken: newAccessToken });
    }
});
exports.refreshTokenController = refreshTokenController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const refreshToken = (_d = req.cookies) === null || _d === void 0 ? void 0 : _d.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const validUserSession = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!validUserSession) {
        return res.sendStatus(401);
    }
    yield session_repository_1.sessionRepository.deleteSessionWhenLogout(validUserSession._id);
    res.sendStatus(204);
});
exports.logoutController = logoutController;
const passwordRecoveryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const registeredUser = yield user_service_1.usersService.findUserByEmail(email);
    if (!registeredUser) {
        res.sendStatus(204);
        return;
    }
    const passwordRecoveryObj = {
        recoveryCode: (0, uuid_1.v4)(),
        expirationDate: (0, add_1.default)(new Date(), {
            hours: 1,
            minutes: 30,
        }),
        isUsed: false,
    };
    registeredUser.passwordRecovery = passwordRecoveryObj;
    const updatedUserRecCode = yield users_repository_1.usersRepository.setRecoveryCode(registeredUser._id, passwordRecoveryObj);
    try {
        const result = yield email_manager_1.emailManager.sendPasswordRecoveryMessage(registeredUser);
        res.sendStatus(204);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});
exports.passwordRecoveryController = passwordRecoveryController;
const confirmPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recoveryCode = req.body.recoveryCode.toString();
    const newPassword = req.body.newPassword;
    if (!recoveryCode) {
        res.sendStatus(400);
        return;
    }
    const isRecoveryCodeValid = yield users_repository_1.usersRepository.checkRecoveryCode(recoveryCode);
    if (!isRecoveryCodeValid) {
        return res.status(400).send({
            errorsMessages: [
                {
                    message: 'RecoveryCode is NOT valid',
                    field: 'recoveryCode',
                },
            ],
        });
    }
    const updateRecoveryCodeAndPasswordResult = yield user_service_1.usersService.updateRecoveryCodeAndPassword(recoveryCode, newPassword);
    res.sendStatus(204);
});
exports.confirmPasswordController = confirmPasswordController;
