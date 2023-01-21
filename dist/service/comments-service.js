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
exports.commentService = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
exports.commentService = {
    getCommentByIdService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repository_1.commentRepository.getCommentById(id);
        });
    },
    updateCommentByIdService(commentId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResponse = { status: 0 };
            const comment = yield comments_repository_1.commentRepository.getCommentById(commentId);
            let commentOwner;
            if (comment) {
                commentOwner = comment.userId;
            }
            else {
                updateResponse.status = 404;
                return updateResponse;
            }
            if (commentOwner !== userId) {
                updateResponse.status = 403;
                return updateResponse;
            }
            const result = yield comments_repository_1.commentRepository.updateCommentById(commentId, content);
            return result ? { status: 204 } : { status: 404 };
        });
    },
    deleteCommentByIdService(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResponse = { status: 0 };
            const comment = yield comments_repository_1.commentRepository.getCommentById(commentId);
            let commentOwner;
            if (comment) {
                commentOwner = comment.userId;
            }
            else {
                deleteResponse.status = 404;
                return deleteResponse;
            }
            if (commentOwner !== userId) {
                deleteResponse.status = 403;
                return deleteResponse;
            }
            const result = yield comments_repository_1.commentRepository.deleteCommentById(commentId);
            return result ? { status: 204 } : { status: 404 };
        });
    },
    createCommentService(postId, userId, userLogin, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentToInsert = {
                postId,
                content,
                userId,
                userLogin,
                createdAt: new Date().toISOString(),
            };
            const createdComment = yield comments_repository_1.commentRepository.createComment(commentToInsert);
            return createdComment;
        });
    },
    likeCommentService(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield this.getCommentByIdService(commentId);
            if (!foundComment)
                return 404;
            try {
                if (likeStatus === 'None')
                    return 204;
                const likeComment = yield comments_repository_1.commentRepository.likeComment(userId, commentId, likeStatus);
                // const updateUsersLikes = await usersRepository.updateCommentLikes(
                //   userId,
                //   commentId,
                //   likeStatus
                // );
                return 204;
            }
            catch (error) {
                console.error(error);
                return 404;
            }
        });
    },
};
