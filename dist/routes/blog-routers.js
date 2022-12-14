"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => {
    const foundBlogs = blogs_repository_1.blogsRepository.findBlogs();
    res.send(foundBlogs);
});
exports.blogRouter.post('/', basic_auth_middleware_1.basicAuthMiddleware, input_validation_middleware_1.blogNameValidation, input_validation_middleware_1.blogDescriptionValidation, input_validation_middleware_1.blogWebsiteUrlValidation, input_validation_middleware_1.inputValidatiomMiddleware, (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
});
exports.blogRouter.get('/:id', (req, res) => {
    const blogFound = blogs_repository_1.blogsRepository.findBlogById(req.params.id.toString());
    if (blogFound) {
        res.send(blogFound);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogRouter.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, input_validation_middleware_1.blogNameValidation, input_validation_middleware_1.blogDescriptionValidation, input_validation_middleware_1.blogWebsiteUrlValidation, input_validation_middleware_1.inputValidatiomMiddleware, (req, res) => {
    const isBlogUpdated = blogs_repository_1.blogsRepository.updateBlogById(req.params.id.toString(), req.body);
    if (isBlogUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogRouter.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, (req, res) => {
    const isBlogDeleted = blogs_repository_1.blogsRepository.deleteBlogById(req.params.id.toString());
    if (!isBlogDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
