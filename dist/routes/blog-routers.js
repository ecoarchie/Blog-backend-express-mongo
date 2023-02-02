"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const blog_controllers_1 = require("../controllers/blog-controllers");
const basic_auth_middleware_1 = require("../middlewares/basic-auth-middleware");
const jwt_auth_mware_1 = require("../middlewares/jwt-auth-mware");
exports.blogRouter = (0, express_1.Router)();
const blogsController = new blog_controllers_1.BlogsController();
exports.blogRouter.get('/', blogsController.getAllBlogs);
exports.blogRouter.post('/', basic_auth_middleware_1.basicAuthMiddleware, (0, input_validation_middleware_1.blogBodyValidation)(), input_validation_middleware_1.inputValidatiomMiddleware, blogsController.createBlog);
exports.blogRouter.post('/:blogId/posts', basic_auth_middleware_1.basicAuthMiddleware, (0, input_validation_middleware_1.postBodyValidation)(), input_validation_middleware_1.inputValidatiomMiddleware, blogsController.createBlogPost);
exports.blogRouter.get('/:id', blogsController.getBlogById);
exports.blogRouter.put('/:id', basic_auth_middleware_1.basicAuthMiddleware, (0, input_validation_middleware_1.blogBodyValidation)(), input_validation_middleware_1.inputValidatiomMiddleware, blogsController.updateBlogById);
exports.blogRouter.delete('/:id', basic_auth_middleware_1.basicAuthMiddleware, blogsController.deleteBlogById);
exports.blogRouter.get('/:blogId/posts', jwt_auth_mware_1.accessTokenValidation, blogsController.getPostsByBlogId);
