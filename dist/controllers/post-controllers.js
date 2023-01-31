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
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
const posts_repository_1 = require("../repositories/posts-repository");
class PostsController {
    constructor() {
        this.getAllPostsController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, utils_1.setPostQueryParams)(req.query);
            const foundPosts = yield this.postsRepository.getAllPosts(options);
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
            const newPost = yield this.postsService.createPost({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
            });
            res.status(201).send(newPost);
        });
        this.getPostByIdController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postFound = yield this.postsRepository.getPostById(req.params.id.toString());
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
            var _a;
            const isValidPost = yield this.postsService.postsRepository.isPostExist(req.params.postId);
            if (!isValidPost) {
                res.sendStatus(404);
            }
            else {
                const options = (0, utils_1.setCommentsQueryParams)(req.query);
                let comments = yield comments_repository_1.commentRepository.getCommentsByPostId(req.params.postId, options);
                let currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        this.postsRepository = new posts_repository_1.PostsRepository();
    }
}
exports.PostsController = PostsController;
exports.postsController = new PostsController();
