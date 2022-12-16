"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidatiomMiddleware = exports.postContentValidation = exports.postDescriptionValidation = exports.postTitleValidation = exports.blogWebsiteUrlValidation = exports.blogDescriptionValidation = exports.blogNameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogNameValidation = (0, express_validator_1.body)('name')
    .exists()
    .withMessage('Name is required')
    .bail()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name cannot be empty')
    .bail()
    .isLength({ max: 15 })
    .withMessage('Name should be less than 15 symbols');
exports.blogDescriptionValidation = (0, express_validator_1.body)('description')
    .exists()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description should be less than 500 symbols');
exports.blogWebsiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .exists()
    .withMessage('Website URL is required')
    .isLength({ max: 100 })
    .withMessage('URL should be less than 100 symbols')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Not valid URL');
exports.postTitleValidation = (0, express_validator_1.body)('title')
    .exists()
    .withMessage('Post title is requires')
    .bail()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title cannot be empty')
    .bail()
    .isLength({ max: 30 })
    .withMessage('Post title length should be less than 30 symbols');
exports.postDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists()
    .withMessage('Short description is required')
    .bail()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Description cannot be empty')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Description must be less than 100 symbols');
exports.postContentValidation = (0, express_validator_1.body)('content')
    .exists()
    .withMessage('Post content is required')
    .bail()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content cannot be empty')
    .bail()
    .isLength({ max: 1000 })
    .withMessage('Content must be less than 1000 symbols');
const inputValidatiomMiddleware = (req, res, next) => {
    const errorFormatter = ({ msg, param }) => {
        return { message: msg, field: param };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({ errorsMessages: errors.array() });
    }
    else {
        next();
    }
};
exports.inputValidatiomMiddleware = inputValidatiomMiddleware;
