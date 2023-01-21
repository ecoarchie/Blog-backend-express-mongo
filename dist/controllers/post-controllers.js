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
exports.postsController = exports.PostsController = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
const comments_service_1 = require("../service/comments-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
const jwt_service_1 = require("../application/jwt-service");
const db_1 = require("../repositories/db");
class PostsController {
    constructor() {
        this.getAllPostsController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, utils_1.setPostQueryParams)(req.query);
            const foundPosts = yield this.postsService.findPosts(options);
            const totalCount = options.searchNameTerm
                ? foundPosts.length
                : yield this.postsService.countAllPosts();
            const pagesCount = Math.ceil(totalCount / options.pageSize);
            res.send({
                pagesCount,
                page: options.pageNumber,
                pageSize: options.pageSize,
                totalCount,
                items: foundPosts,
            });
        });
        this.createPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newPost = yield this.postsService.createPost(req.body);
            res.status(201).send(newPost);
        });
        this.findPostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postFound = yield this.postsService.findPostById(req.params.id.toString());
            if (postFound) {
                res.send(postFound);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.updatePostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isPostUpdated = yield this.postsService.updatePostById(req.params.id.toString(), req.body);
            if (isPostUpdated) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.deletePostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isPostDeleted = yield this.postsService.deletePostById(req.params.id.toString());
            if (!isPostDeleted) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
        this.getCommentsForPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const isValidPost = yield this.postsService.postsRepository.isPostExist(req.params.postId);
            if (!isValidPost) {
                res.sendStatus(404);
            }
            else {
                const options = (0, utils_1.setCommentsQueryParams)(req.query);
                let comments = yield comments_repository_1.commentRepository.getCommentsByPostId(req.params.postId, options);
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                const cookie = req.cookies;
                console.log('🚀 ~ file: post-controllers.ts:83 ~ PostsController ~ getCommentsForPostController= ~ cookie', cookie);
                let validUserSession;
                let currentUserId;
                let userLikesDislikes;
                if (refreshToken) {
                    validUserSession = yield jwt_service_1.jwtService.verifyToken(refreshToken);
                    currentUserId = validUserSession === null || validUserSession === void 0 ? void 0 : validUserSession.userId;
                    userLikesDislikes = yield db_1.userLikesCollection.findOne({ userId: currentUserId });
                }
                else {
                    userLikesDislikes = null;
                }
                comments = comments.map((comment) => {
                    if (!userLikesDislikes) {
                        comment.likesInfo.myStatus = 'None';
                    }
                    else if (userLikesDislikes.likedComments.includes(comment.id)) {
                        comment.likesInfo.myStatus = 'Like';
                    }
                    else if (userLikesDislikes.dislikedComments.includes(comment.id)) {
                        comment.likesInfo.myStatus = 'Disike';
                    }
                    else {
                        comment.likesInfo.myStatus = 'None';
                    }
                    return comment;
                });
                const totalCount = yield comments_repository_1.commentRepository.countAllCommentsByPostId(req.params.postId);
                const pagesCount = Math.ceil(totalCount / options.pageSize);
                res.send({
                    pagesCount,
                    page: options.pageNumber,
                    pageSize: options.pageSize,
                    totalCount,
                    items: comments,
                });
            }
        });
        this.createCommentForPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.postsService.postsRepository.isPostExist(req.params.postId.toString()))) {
                res.sendStatus(404);
                return;
            }
            const newComment = yield comments_service_1.commentService.createCommentService(req.params.postId, req.user.id, req.user.login, req.body.content);
            res.status(201).send(newComment);
        });
        this.postsService = new post_service_1.PostsService();
    }
}
exports.PostsController = PostsController;
exports.postsController = new PostsController();
