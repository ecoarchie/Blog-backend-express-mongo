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
exports.deleteDeviceSessionController = exports.deleteRestSessionsController = exports.getActiveSessionsController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_service_1 = require("../application/jwt-service");
const session_repository_1 = require("../repositories/session-repository");
const getActiveSessionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const activeSessions = yield session_repository_1.sessionRepository.getActiveSessions(refreshToken);
    if (!activeSessions) {
        return res.sendStatus(401);
    }
    res.send(activeSessions);
});
exports.getActiveSessionsController = getActiveSessionsController;
const deleteRestSessionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isValidToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!isValidToken) {
        return res.sendStatus(401);
    }
    else {
        const jwtPayload = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET);
        const result = yield session_repository_1.sessionRepository.deleteRestSessions(jwtPayload.userId, jwtPayload.deviceId);
        if (result) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(400);
        }
    }
});
exports.deleteRestSessionsController = deleteRestSessionsController;
const deleteDeviceSessionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const isValidToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    if (!isValidToken) {
        return res.sendStatus(401);
    }
    else {
        const deviceIdFromParams = req.params.deviceId;
        const jwtPayload = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET);
        const resultCode = yield session_repository_1.sessionRepository.deleteDeviceSession(jwtPayload.userId, deviceIdFromParams);
        res.sendStatus(resultCode);
    }
});
exports.deleteDeviceSessionController = deleteDeviceSessionController;
