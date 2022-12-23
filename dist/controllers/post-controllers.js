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
exports.deletePostByIdController = exports.updatePostByIdController = exports.findPostByIdController = exports.createPostController = exports.getAllPostsController = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
const service_1 = require("../repositories/service");
const getAllPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, service_1.setQueryParams)(req.query);
    const foundPosts = yield posts_repository_1.postsRepository.findPosts(options);
    const totalCount = options.searchNameTerm
        ? foundPosts.length
        : yield posts_repository_1.postsRepository.countAllPosts();
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
    const newPost = yield posts_repository_1.postsRepository.createPost(req.body);
    res.status(201).send(newPost);
});
exports.createPostController = createPostController;
const findPostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postFound = yield posts_repository_1.postsRepository.findPostById(req.params.id.toString());
    if (postFound) {
        res.send(postFound);
    }
    else {
        res.sendStatus(404);
    }
});
exports.findPostByIdController = findPostByIdController;
const updatePostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostUpdated = yield posts_repository_1.postsRepository.updatePostById(req.params.id.toString(), req.body);
    if (isPostUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.updatePostByIdController = updatePostByIdController;
const deletePostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostDeleted = yield posts_repository_1.postsRepository.deletePostById(req.params.id.toString());
    if (!isPostDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.deletePostByIdController = deletePostByIdController;
