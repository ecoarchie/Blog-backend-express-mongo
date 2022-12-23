"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidatiomMiddleware = exports.postBodyValidation = exports.blogBodyValidation = void 0;
const express_validator_1 = require("express-validator");
const blogBodyValidation = () => {
    return [
        (0, express_validator_1.body)('name')
            .exists()
            .withMessage('Name is required')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name cannot be empty')
            .isLength({ max: 15 })
            .withMessage('Name should be less than 15 symbols'),
        (0, express_validator_1.body)('description')
            .exists()
            .withMessage('Description is required')
            .isLength({ max: 500 })
            .withMessage('Description should be less than 500 symbols'),
        (0, express_validator_1.body)('websiteUrl')
            .exists()
            .withMessage('Website URL is required')
            .isLength({ max: 100 })
            .withMessage('URL should be less than 100 symbols')
            .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
            .withMessage('Not valid URL'),
    ];
};
exports.blogBodyValidation = blogBodyValidation;
const postBodyValidation = () => {
    return [
        (0, express_validator_1.body)('title')
            .exists()
            .withMessage('Post title is requires')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ max: 30 })
            .withMessage('Post title length should be less than 30 symbols'),
        (0, express_validator_1.body)('shortDescription')
            .exists()
            .withMessage('Short description is required')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Description cannot be empty')
            .isLength({ max: 100 })
            .withMessage('Description must be less than 100 symbols'),
        (0, express_validator_1.body)('content')
            .exists()
            .withMessage('Post content is required')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Content cannot be empty')
            .isLength({ max: 1000 })
            .withMessage('Content must be less than 1000 symbols'),
    ];
};
exports.postBodyValidation = postBodyValidation;
const inputValidatiomMiddleware = (req, res, next) => {
    const errorFormatter = ({ msg, param }) => {
        return { message: msg, field: param };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({ errorsMessages: errors.array({ onlyFirstError: true }) });
    }
    else {
        next();
    }
};
exports.inputValidatiomMiddleware = inputValidatiomMiddleware;
