"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get('/', (req, res) => {
    const foundBlogs = blogs_repository_1.blogsRepository.findBlogs();
    res.send(foundBlogs);
});
exports.blogRouter.post('/', (req, res) => {
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
