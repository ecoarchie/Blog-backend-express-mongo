"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => {
    const foundBlogs = blogs_repository_1.blogsRepository.findBlogs();
    res.send(foundBlogs);
});
const blogNameValidation = (0, express_validator_1.body)('name')
    .exists()
    .withMessage('Name is required')
    .isLength({ max: 15 })
    .withMessage('Name should be less than 15 symbols');
const blogDescriptionValidation = (0, express_validator_1.body)('description')
    .exists()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description should be less than 500 symbols');
const blogWebsiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .exists()
    .withMessage('Website URL is required')
    .isLength({ max: 100 })
    .withMessage('URL should be less than 100 symbols')
    .isURL()
    .withMessage('Not valid URL');
exports.blogRouter.post('/', blogNameValidation, blogDescriptionValidation, blogWebsiteUrlValidation, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let errArray = errors
            .array()
            .map((e) => ({ message: e.msg, field: e.param }));
        return res.status(400).send({ errorsMessages: errArray });
    }
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
exports.blogRouter.put('/:id', (req, res) => {
    const isBlogUpdated = blogs_repository_1.blogsRepository.updateBlogById(req.params.id.toString(), req.body);
    if (isBlogUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogRouter.delete('/:id', (req, res) => {
    const isBlogDeleted = blogs_repository_1.blogsRepository.deleteBlogById(req.params.id.toString());
    if (!isBlogDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
