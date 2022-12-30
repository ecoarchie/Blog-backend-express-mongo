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
exports.createCommentForPostController = exports.getCommentsForPostController = exports.deletePostByIdController = exports.updatePostByIdController = exports.findPostByIdController = exports.createPostController = exports.getAllPostsController = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
const posts_repository_1 = require("../repositories/posts-repository");
const comments_service_1 = require("../service/comments-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
const getAllPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, utils_1.setPostQueryParams)(req.query);
    const foundPosts = yield post_service_1.postsService.findPosts(options);
    const totalCount = options.searchNameTerm
        ? foundPosts.length
        : yield post_service_1.postsService.countAllPosts();
    const pagesCount = Math.ceil(totalCount / options.pageSize);
    res.send({
        pagesCount,
        page: options.pageNumber,
        pageSize: options.pageSize,
        totalCount,
        items: foundPosts,
    });
});
exports.getAllPostsController = getAllPostsController;
const createPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield post_service_1.postsService.createPost(req.body);
    res.status(201).send(newPost);
});
exports.createPostController = createPostController;
const findPostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postFound = yield post_service_1.postsService.findPostById(req.params.id.toString());
    if (postFound) {
        res.send(postFound);
    }
    else {
        res.sendStatus(404);
    }
});
exports.findPostByIdController = findPostByIdController;
const updatePostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostUpdated = yield post_service_1.postsService.updatePostById(req.params.id.toString(), req.body);
    if (isPostUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.updatePostByIdController = updatePostByIdController;
const deletePostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostDeleted = yield post_service_1.postsService.deletePostById(req.params.id.toString());
    if (!isPostDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.deletePostByIdController = deletePostByIdController;
const getCommentsForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidPost = yield posts_repository_1.postsRepository.isPostExist(req.params.postId);
    if (!isValidPost) {
        res.sendStatus(404);
    }
    else {
        const options = (0, utils_1.setCommentsQueryParams)(req.query);
        const comments = yield comments_repository_1.commentRepository.getCommentsByPostId(req.params.postId, options);
        const totalCount = Object.keys(req.query).length !== 0
            ? comments.length
            : yield comments_repository_1.commentRepository.countAllCommentsByPostId(req.params.postId);
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
exports.getCommentsForPostController = getCommentsForPostController;
const createCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield posts_repository_1.postsRepository.isPostExist(req.params.postId.toString()))) {
        console.log('post not exist');
        res.sendStatus(404);
        return;
    }
    console.log('here');
    const newComment = yield comments_service_1.commentService.createCommentService(req.params.postId, req.user.id, req.user.login, req.body.content);
    res.status(201).send(newComment);
});
exports.createCommentForPostController = createCommentForPostController;
