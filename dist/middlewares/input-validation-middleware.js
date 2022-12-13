"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidatiomMiddleware = exports.blogWebsiteUrlValidation = exports.blogDescriptionValidation = exports.blogNameValidation = void 0;
const express_validator_1 = require("express-validator");
const customizeErrors = (errors) => {
    return errors.array().map((e) => ({ message: e.msg, field: e.param }));
};
exports.blogNameValidation = (0, express_validator_1.body)('name')
    .exists()
    .withMessage('Name is required')
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
const inputValidatiomMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let errArray = customizeErrors(errors);
        res.status(400).send({ errorsMessages: errArray });
    }
    else {
        next();
    }
};
exports.inputValidatiomMiddleware = inputValidatiomMiddleware;
