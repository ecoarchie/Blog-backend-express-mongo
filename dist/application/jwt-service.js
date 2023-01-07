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
const db_1 = require("../repositories/db");
exports.jwtService = {
    createJwt(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET, { expiresIn: '10s' });
            return token;
        });
    },
    createJwtRefresh(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET, { expiresIn: '20s' });
            yield this.addRefreshTokenToDB(token);
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
    addRefreshTokenToDB(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenObj = {
                refreshToken: token,
                isValid: true,
            };
            const result = yield db_1.tokensCollection.insertOne(tokenObj);
        });
    },
    revokeRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensCollection.findOneAndUpdate({ refreshToken: token }, { $set: { isValid: false } });
        });
    },
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, process.env.SECRET);
                if (result.exp < Date.now() / 1000) {
                    return null;
                }
                const checkToken = yield db_1.tokensCollection.findOne({ refreshToken: token });
                if (checkToken && checkToken.isValid) {
                    return result.userId;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    },
};
