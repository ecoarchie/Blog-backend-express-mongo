"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const blog_id_custom_validator_1 = require("../middlewares/blog-id-custom-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.get('/', (req, res) => {
    const foundPosts = posts_repository_1.postsRepository.findPosts();
    res.send(foundPosts);
});
exports.postRouter.post('/', basic_auth_middleware_1.basicAuthMiddleware, blog_id_custom_validator_1.isValidBlogId, input_validation_middleware_1.postTitleValidation, input_validation_middleware_1.postDescriptionValidation, input_validation_middleware_1.postContentValidation, input_validation_middleware_1.inputValidatiomMiddleware, (req, res) => {
    const newPost = posts_repository_1.postsRepository.createPost(req.body);
    res.status(201).send(newPost);
});
exports.postRouter.get('/:id', (req, res) => {
    const postFound = posts_repository_1.postsRepository.findPostById(req.params.id.toString());
    if (postFound) {
        res.send(postFound);
    }
    else {
        res.sendStatus(404);
    }
});
