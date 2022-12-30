"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth-controllers");
const jwt_auth_mware_1 = require("../middlewares/jwt-auth-mware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', auth_controllers_1.loginUserController);
exports.authRouter.get('/me', jwt_auth_mware_1.jwtAuthMware, auth_controllers_1.getCurrentUserInfoController);
