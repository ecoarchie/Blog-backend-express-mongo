"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const blog_controllers_1 = require("./controllers/blog-controllers");
const blogs_repository_1 = require("./repositories/blogs-repository");
const blog_service_1 = require("./service/blog-service");
const post_service_1 = require("./service/post-service");
const posts_repository_1 = require("./repositories/posts-repository");
const post_controllers_1 = require("./controllers/post-controllers");
const comments_controllers_1 = require("./controllers/comments-controllers");
const comments_service_1 = require("./service/comments-service");
const comments_repository_1 = require("./repositories/comments-repository");
const blogs_queryRepository_1 = require("./repositories/queryRepositories/blogs.queryRepository");
const posts_queryRepository_1 = require("./repositories/queryRepositories/posts.queryRepository");
exports.container = new inversify_1.Container();
exports.container.bind(blog_controllers_1.BlogsController).to(blog_controllers_1.BlogsController);
exports.container.bind(blog_service_1.BlogsService).to(blog_service_1.BlogsService);
exports.container.bind(blogs_repository_1.BlogsRepository).to(blogs_repository_1.BlogsRepository);
exports.container.bind(blogs_queryRepository_1.BlogsQueryRepository).to(blogs_queryRepository_1.BlogsQueryRepository);
exports.container.bind(post_controllers_1.PostsController).to(post_controllers_1.PostsController);
exports.container.bind(post_service_1.PostsService).to(post_service_1.PostsService);
exports.container.bind(posts_repository_1.PostsRepository).to(posts_repository_1.PostsRepository);
exports.container.bind(posts_queryRepository_1.PostsQueryRepository).to(posts_queryRepository_1.PostsQueryRepository);
exports.container.bind(comments_controllers_1.CommentController).to(comments_controllers_1.CommentController);
exports.container.bind(comments_service_1.CommentService).to(comments_service_1.CommentService);
exports.container.bind(comments_repository_1.CommentRepository).to(comments_repository_1.CommentRepository);
