"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.BlogsController = void 0;
const blog_service_1 = require("../service/blog-service");
const post_service_1 = require("../service/post-service");
const utils_1 = require("./utils");
const blogs_repository_1 = require("../repositories/blogs-repository");
const inversify_1 = require("inversify");
let BlogsController = class BlogsController {
    constructor(blogsService, postsService, blogsRepository) {
        this.blogsService = blogsService;
        this.postsService = postsService;
        this.blogsRepository = blogsRepository;
        this.getAllBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, utils_1.setBlogQueryParams)(req.query);
            const foundBlogs = yield this.blogsRepository.findBlogs(options);
            const totalCount = options.searchNameTerm
                ? foundBlogs.length
                : yield this.blogsRepository.countAllBlogs();
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
            const newBlog = yield this.blogsService.createBlog({
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            });
            res.status(201).send(newBlog);
        });
        this.createBlogPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsRepository.findBlogById(req.params.blogId.toString());
            if (!blog) {
                res.sendStatus(404);
            }
            else {
                const postCreated = yield this.postsService.createBlogPost({
                    blogId: blog.id,
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                });
                res.status(201).send(postCreated);
            }
        });
        this.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogFound = yield this.blogsRepository.findBlogById(req.params.id.toString());
            if (blogFound) {
                res.status(200).send(blogFound);
            }
            else {
                res.sendStatus(404);
            }
        });
        this.updateBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const isBlogUpdated = yield this.blogsService.updateBlogById(req.params.id.toString(), {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            });
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
            var _a;
            const blog = yield this.blogsRepository.findBlogById(req.params.blogId.toString());
            if (!blog) {
                res.sendStatus(404);
            }
            else {
                const { pageNumber, pageSize, sortBy, sortDirection, skip } = (0, utils_1.setBlogQueryParams)(req.query);
                const posts = yield this.blogsRepository.findPostsByBlogId(blog.id.toString(), skip, pageSize, sortBy, sortDirection, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '');
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
        });
    }
};
BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blog_service_1.BlogsService,
        post_service_1.PostsService,
        blogs_repository_1.BlogsRepository])
], BlogsController);
exports.BlogsController = BlogsController;
