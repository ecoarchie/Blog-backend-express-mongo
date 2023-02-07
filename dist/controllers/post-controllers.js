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
exports.PostsController = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
const comments_service_1 = require("../service/comments-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
const posts_repository_1 = require("../repositories/posts-repository");
const inversify_1 = require("inversify");
let PostsController = class PostsController {
    constructor(postsService, postsRepository, commentRepository, commentService) {
        this.postsService = postsService;
        this.postsRepository = postsRepository;
        this.commentRepository = commentRepository;
        this.commentService = commentService;
        this.getAllPostsController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const pageNumber = Number(req.query.pageNumber) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const skip = (pageNumber - 1) * pageSize;
            const postsQueryParams = {
                searchNameTerm: req.query.searchNameTerm || null,
                pageNumber,
                pageSize,
                sortBy: ((_a = req.query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || 'createdAt',
                sortDirection: req.query.sortDirection || 'desc',
                skip,
            };
            const foundPosts = yield this.postsRepository.getAllPosts(postsQueryParams, ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || '');
            res.send(foundPosts);
        });
        this.createPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newPost = yield this.postsService.createPost({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
            });
            res.status(201).send(newPost);
        });
        this.getPostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const postFound = yield this.postsRepository.getPostById(req.params.id.toString(), ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || '');
            if (postFound) {
                res.send(postFound);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.updatePostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const updateParams = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
            };
            const isPostUpdated = yield this.postsService.updatePostById(req.params.id.toString(), updateParams);
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
        //TODO refactor this
        this.getCommentsForPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const isValidPost = yield this.postsRepository.isPostExist(req.params.postId);
            if (!isValidPost) {
                res.sendStatus(404);
            }
            else {
                const options = (0, utils_1.setCommentsQueryParams)(req.query);
                let comments = yield this.commentRepository.getCommentsByPostId(req.params.postId, options);
                let currentUserId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
                let userLikesDislikes = null;
                if (currentUserId) {
                    userLikesDislikes = yield db_1.userLikesCollection.findOne({
                        userId: new mongodb_1.ObjectId(currentUserId),
                    });
                }
                comments = comments.map((comment) => {
                    if (!(userLikesDislikes === null || userLikesDislikes === void 0 ? void 0 : userLikesDislikes.likedComments.includes(comment.id)) &&
                        !(userLikesDislikes === null || userLikesDislikes === void 0 ? void 0 : userLikesDislikes.dislikedComments.includes(comment.id))) {
                        comment.likesInfo.myStatus = 'None';
                    }
                    else if (userLikesDislikes.likedComments.includes(comment.id)) {
                        comment.likesInfo.myStatus = 'Like';
                    }
                    else if (userLikesDislikes.dislikedComments.includes(comment.id)) {
                        comment.likesInfo.myStatus = 'Dislike';
                    }
                    else {
                        comment.likesInfo.myStatus = 'None';
                    }
                    return comment;
                });
                const totalCount = yield this.commentRepository.countAllCommentsByPostId(req.params.postId);
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
            if (!(yield this.postsRepository.isPostExist(req.params.postId.toString()))) {
                res.sendStatus(404);
                return;
            }
            const newComment = yield this.commentService.createCommentService(req.params.postId, req.user.id, req.user.login, req.body.content);
            res.status(201).send(newComment);
        });
        this.likePostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user ? req.user.id : '';
            const postId = req.params.postId;
            const likeStatus = req.body.likeStatus;
            const resStatus = yield this.postsService.likePostService(userId, postId, likeStatus);
            res.sendStatus(resStatus);
        });
    }
};
PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(post_service_1.PostsService)),
    __param(1, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __param(2, (0, inversify_1.inject)(comments_repository_1.CommentRepository)),
    __param(3, (0, inversify_1.inject)(comments_service_1.CommentService)),
    __metadata("design:paramtypes", [post_service_1.PostsService,
        posts_repository_1.PostsRepository,
        comments_repository_1.CommentRepository,
        comments_service_1.CommentService])
], PostsController);
exports.PostsController = PostsController;
