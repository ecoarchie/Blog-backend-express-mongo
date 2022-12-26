"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
exports.commentRouter = (0, express_1.Router)();
exports.commentRouter.get('/:id', getCommentByIdController);
exports.commentRouter.put('/:commentId', updateCommentByIdController);
exports.commentRouter.delete('/:commentId', deleteCommentByIdController);
