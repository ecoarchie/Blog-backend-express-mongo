"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = void 0;
const blog_controllers_1 = require("./controllers/blog-controllers");
const blogs_repository_1 = require("./repositories/blogs-repository");
const blog_service_1 = require("./service/blog-service");
const blogsRepository = new blogs_repository_1.BlogsRepository();
const blogsService = new blog_service_1.BlogsService(blogsRepository);
exports.blogsController = new blog_controllers_1.BlogsController(blogsService);
