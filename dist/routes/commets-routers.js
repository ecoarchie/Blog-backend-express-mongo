"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const comments_controllers_1 = require("../controllers/comments-controllers");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const jwt_auth_mware_1 = require("../middlewares/jwt-auth-mware");
exports.commentRouter = (0, express_1.Router)();
exports.commentRouter.get('/:id', comments_controllers_1.getCommentByIdController);
exports.commentRouter.put('/:commentId', jwt_auth_mware_1.jwtAuthMware, (0, input_validation_middleware_1.commentBodyValidation)(), input_validation_middleware_1.inputValidatiomMiddleware, comments_controllers_1.updateCommentByIdController);
exports.commentRouter.delete('/:commentId', jwt_auth_mware_1.jwtAuthMware, comments_controllers_1.deleteCommentByIdController);