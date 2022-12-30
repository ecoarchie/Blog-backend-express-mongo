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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentByIdController = exports.updateCommentByIdController = exports.getCommentByIdController = void 0;
const comments_service_1 = require("../service/comments-service");
const getCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentFound = yield comments_service_1.commentService.getCommentByIdService(req.params.id.toString());
    if (commentFound) {
        res.status(200).send(commentFound);
    }
    else {
        res.sendStatus(404);
    }
});
exports.getCommentByIdController = getCommentByIdController;
const updateCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const content = req.body.content.toString();
    const updateResult = yield comments_service_1.commentService.updateCommentByIdService(req.params.commentId.toString(), userId, content);
    res.sendStatus(updateResult.status);
});
exports.updateCommentByIdController = updateCommentByIdController;
const deleteCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const deleteResult = yield comments_service_1.commentService.deleteCommentByIdService(userId, req.params.commentId.toString());
    res.sendStatus(deleteResult.status);
});
exports.deleteCommentByIdController = deleteCommentByIdController;
