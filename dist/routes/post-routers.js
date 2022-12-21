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
exports.postRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const blog_id_custom_validator_1 = require("../middlewares/blog-id-custom-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
const service_1 = require("../repositories/service");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, service_1.setQueryParams)(req.query);
    // console.log(options);
    const foundPosts = yield posts_repository_1.postsRepository.findPosts(options);
    // const totalCount: number = await postsRepository.countAllPosts();
    const totalCount = foundPosts.length;
    const pagesCount = Math.ceil(totalCount / options.pageSize);
    res.send({
        pagesCount,
        page: options.pageNumber,
        pageSize: options.pageSize,
        totalCount,
        items: foundPosts,
    });
}));
exports.postRouter.post('/', basic_auth_middleware_1.basicAuthMiddleware, blog_id_custom_validator_1.isValidBlogId, input_validation_middleware_1.postTitleValidation, input_validation_middleware_1.postDescriptionValidation, input_validation_middleware_1.postContentValidation, input_validation_middleware_1.inputValidatiomMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_repository_1.postsRepository.createPost(req.body);
    res.status(201).send(newPost);
}));
exports.postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postFound = yield posts_repository_1.postsRepository.findPostById(req.params.id.toString());
    if (postFound) {
        res.send(postFound);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, blog_id_custom_validator_1.isValidBlogId, input_validation_middleware_1.postTitleValidation, input_validation_middleware_1.postDescriptionValidation, input_validation_middleware_1.postContentValidation, input_validation_middleware_1.inputValidatiomMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostUpdated = yield posts_repository_1.postsRepository.updatePostById(req.params.id.toString(), req.body);
    if (isPostUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postRouter.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostDeleted = yield posts_repository_1.postsRepository.deletePostById(req.params.id.toString());
    if (!isPostDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
