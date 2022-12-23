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
exports.getPostsByBlogIdController = exports.deleteBlogByIdController = exports.updateBlogByIdController = exports.getBlogByIdcontroller = exports.createBlogPostController = exports.createBlogController = exports.getAllBlogsController = void 0;
const blog_service_1 = require("../service/blog-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
const getAllBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, utils_1.setQueryParams)(req.query);
    const foundBlogs = yield blog_service_1.blogsService.findBlogs(options);
    const totalCount = options.searchNameTerm
        ? foundBlogs.length
        : yield blog_service_1.blogsService.countAllBlogs();
    const pagesCount = Math.ceil(totalCount / options.pageSize);
    res.send({
        pagesCount,
        page: options.pageNumber,
        pageSize: options.pageSize,
        totalCount,
        items: foundBlogs,
    });
});
exports.getAllBlogsController = getAllBlogsController;
const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blog_service_1.blogsService.createBlog(req.body);
    res.status(201).send(newBlog);
});
exports.createBlogController = createBlogController;
const createBlogPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.blogsService.findBlogById(req.params.blogId.toString());
    if (!blog) {
        res.sendStatus(404);
    }
    else {
        const postCreated = yield post_service_1.postsService.createBlogPost(blog.id, req.body);
        res.status(201).send(postCreated);
    }
});
exports.createBlogPostController = createBlogPostController;
const getBlogByIdcontroller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogFound = yield blog_service_1.blogsService.findBlogById(req.params.id.toString());
    if (blogFound) {
        res.status(200).send(blogFound);
    }
    else {
        res.sendStatus(404);
    }
});
exports.getBlogByIdcontroller = getBlogByIdcontroller;
const updateBlogByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogUpdated = yield blog_service_1.blogsService.updateBlogById(req.params.id.toString(), req.body);
    if (isBlogUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.updateBlogByIdController = updateBlogByIdController;
const deleteBlogByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogDeleted = yield blog_service_1.blogsService.deleteBlogById(req.params.id.toString());
    if (!isBlogDeleted) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.deleteBlogByIdController = deleteBlogByIdController;
const getPostsByBlogIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.blogsService.findBlogById(req.params.blogId.toString());
    if (blog) {
        const { pageNumber, pageSize, sortBy, sortDirection, skip } = (0, utils_1.setQueryParams)(req.query);
        const posts = yield post_service_1.postsService.findPostsByBlogId(blog.id.toString(), skip, pageSize, sortBy, sortDirection);
        const totalCount = yield post_service_1.postsService.countPostsByBlogId(blog.id.toString());
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
exports.getPostsByBlogIdController = getPostsByBlogIdController;
