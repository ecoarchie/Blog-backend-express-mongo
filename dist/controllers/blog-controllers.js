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
exports.blogsController = void 0;
const blog_service_1 = require("../service/blog-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
class BlogsController {
    constructor() {
        this.getAllBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, utils_1.setBlogQueryParams)(req.query);
            const foundBlogs = yield this.blogsService.findBlogs(options);
            const totalCount = options.searchNameTerm
                ? foundBlogs.length
                : yield this.blogsService.countAllBlogs();
            const pagesCount = Math.ceil(totalCount / options.pageSize);
            res.send({
                pagesCount,
                page: options.pageNumber,
                pageSize: options.pageSize,
                totalCount,
                items: foundBlogs,
            });
        });
        this.createBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield this.blogsService.createBlog(req.body);
            res.status(201).send(newBlog);
        });
        this.createBlogPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsService.findBlogById(req.params.blogId.toString());
            if (!blog) {
                res.sendStatus(404);
            }
            else {
                const postCreated = yield this.postsService.createBlogPost(blog.id, req.body);
                res.status(201).send(postCreated);
            }
        });
        this.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogFound = yield this.blogsService.findBlogById(req.params.id.toString());
            if (blogFound) {
                res.status(200).send(blogFound);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.updateBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isBlogUpdated = yield this.blogsService.updateBlogById(req.params.id.toString(), req.body);
            if (isBlogUpdated) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.deleteBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isBlogDeleted = yield this.blogsService.deleteBlogById(req.params.id.toString());
            if (!isBlogDeleted) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
        this.getPostsByBlogId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsService.findBlogById(req.params.blogId.toString());
            if (blog) {
                const { pageNumber, pageSize, sortBy, sortDirection, skip } = (0, utils_1.setBlogQueryParams)(req.query);
                const posts = yield this.postsService.findPostsByBlogId(blog.id.toString(), skip, pageSize, sortBy, sortDirection);
                const totalCount = yield this.postsService.countPostsByBlogId(blog.id.toString());
                const pagesCount = Math.ceil(totalCount / pageSize);
                res.send({
                    pagesCount,
                    page: pageNumber,
                    pageSize,
                    totalCount,
                    items: posts,
                });
            }
            else {
                res.sendStatus(404);
            }
        });
        this.blogsService = new blog_service_1.BlogsService();
        this.postsService = new post_service_1.PostsService();
    }
}
exports.blogsController = new BlogsController();
