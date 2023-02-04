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
exports.isValidBlogId = void 0;
const express_validator_1 = require("express-validator");
const blogs_queryRepository_1 = require("../repositories/queryRepositories/blogs.queryRepository");
const blogsQueryRepository = new blogs_queryRepository_1.BlogsQueryRepository();
exports.isValidBlogId = (0, express_validator_1.body)('blogId')
    .exists()
    .withMessage('Post ID is required')
    .custom((id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield blogsQueryRepository.getBlogById(id))) {
        throw new Error("Blog with this ID doesn't exist");
    }
    return true;
}));
