"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.CommentService = void 0;
const inversify_1 = require("inversify");
const comments_repository_1 = require("../repositories/comments-repository");
let CommentService = class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    getCommentByIdService(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commentRepository.getCommentById(commentId, userId);
        });
    }
    updateCommentByIdService(commentId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResponse = { status: 0 };
            const comment = yield this.commentRepository.getCommentById(commentId, userId);
            let commentOwner;
            if (comment) {
                commentOwner = comment.commentatorInfo.userId;
            }
            else {
                updateResponse.status = 404;
                return updateResponse;
            }
            if (commentOwner !== userId) {
                updateResponse.status = 403;
                return updateResponse;
            }
            const result = yield this.commentRepository.updateCommentById(commentId, content);
            return result ? { status: 204 } : { status: 404 };
        });
    }
    deleteCommentByIdService(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResponse = { status: 0 };
            const comment = yield this.commentRepository.getCommentById(commentId, userId);
            let commentOwner;
            if (comment) {
                commentOwner = comment.commentatorInfo.userId;
            }
            else {
                deleteResponse.status = 404;
                return deleteResponse;
            }
            if (commentOwner !== userId) {
                deleteResponse.status = 403;
                return deleteResponse;
            }
            const result = yield this.commentRepository.deleteCommentById(commentId);
            return result ? { status: 204 } : { status: 404 };
        });
    }
    createCommentService(postId, userId, userLogin, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentToInsert = {
                postId,
                content,
                commentatorInfo: { userId, userLogin },
                createdAt: new Date().toISOString(),
            };
            const createdComment = yield this.commentRepository.createComment(commentToInsert);
            return createdComment;
        });
    }
    likeCommentService(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield this.getCommentByIdService(commentId, userId);
            if (!foundComment)
                return 404;
            try {
                const likeComment = yield this.commentRepository.likeComment(userId, commentId, likeStatus);
                return 204;
            }
            catch (error) {
                console.error(error);
                return 404;
            }
        });
    }
};
CommentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_repository_1.CommentRepository)),
    __metadata("design:paramtypes", [comments_repository_1.CommentRepository])
], CommentService);
exports.CommentService = CommentService;
