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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const db_1 = require("../repositories/db");
exports.jwtService = {
    createJwt(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET, { expiresIn: '2h' });
            return token;
        });
    },
    createJwtRefresh(userId, lastActiveDate, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ userId, lastActiveDate, deviceId }, process.env.SECRET, {
                expiresIn: '20h',
            });
            return token;
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, process.env.SECRET);
                return result.userId;
            }
            catch (error) {
                return null;
            }
        });
    },
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, process.env.SECRET);
                if (result.exp < Date.now() / 1000) {
                    return null;
                }
                const checkToken = yield db_1.userSessionCollection.findOne({
                    $and: [
                        { lastActiveDate: result.lastActiveDate },
                        { deviceId: result.deviceId },
                        { userId: new mongodb_1.ObjectId(result.userId) },
                    ],
                });
                return checkToken;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    },
};
