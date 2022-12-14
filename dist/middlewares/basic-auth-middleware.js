"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const basicAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.sendStatus(401);
    }
    const encoded = authorization.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(':');
    if (username !== 'admin' || password !== 'qwerty') {
        return res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
