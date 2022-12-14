"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBlogId = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.isValidBlogId = (0, express_validator_1.body)('blogId')
    .exists()
    .withMessage('Post ID is required')
    .custom((id) => {
    if (!blogs_repository_1.blogsRepository.findBlogById(id)) {
        throw new Error("Blog with this ID doesn't exist");
    }
    return true;
});
