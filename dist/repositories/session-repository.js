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
exports.sessionRepository = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const jwt_service_1 = require("../application/jwt-service");
const db_1 = require("./db");
exports.sessionRepository = {
    getActiveSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
            if (!isValidToken) {
                return null;
            }
            else {
                const jwtPayload = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET);
                const userId = jwtPayload.userId;
                const result = yield db_1.userSessionCollection
                    .find({ userId: new mongodb_1.ObjectId(userId) })
                    .toArray();
                return result.map((session) => ({
                    ip: session.ip,
                    title: session.title,
                    lastActiveDate: session.lastActiveDate,
                    deviceId: session.deviceId,
                }));
            }
        });
    },
    deleteRestSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.userSessionCollection.deleteMany({
                $and: [{ userId: new mongodb_1.ObjectId(userId) }, { deviceId: { $ne: deviceId } }],
            });
            return result.acknowledged;
        });
    },
    deleteDeviceSession(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundSession = yield db_1.userSessionCollection.findOne({ deviceId });
            if (!foundSession) {
                return 404;
            }
            if (foundSession.userId.toString() !== userId) {
                return 403;
            }
            else {
                try {
                    yield db_1.userSessionCollection.deleteOne({ deviceId });
                    return 204;
                }
                catch (error) {
                    console.log(error);
                    console.log('cannot delete device session');
                    return 400;
                }
            }
        });
    },
    deleteSessionWhenLogout(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userSessionCollection.deleteOne({ _id: sessionId });
        });
    },
};
