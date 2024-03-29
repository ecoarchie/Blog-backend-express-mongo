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
exports.accessTokenValidation = exports.jwtAuthMware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_service_1 = require("../application/jwt-service");
const user_service_1 = require("../service/user-service");
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const jwtAuthMware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.sendStatus(401);
    }
    const token = authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    const result = userId
        ? yield db_1.userSessionCollection.findOne({ userId: new mongodb_1.ObjectId(userId) })
        : null;
    if (!result)
        return res.sendStatus(401);
    if (userId) {
        req.user = yield user_service_1.usersService.findUserByIdService(userId);
        return next();
    }
    res.sendStatus(401);
});
exports.jwtAuthMware = jwtAuthMware;
const accessTokenValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers.authorization;
    if (!authorization) {
        req.user = null;
        return next();
    }
    const token = authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = yield user_service_1.usersService.findUserByIdService(userId);
        return next();
    }
    return next();
});
exports.accessTokenValidation = accessTokenValidation;
