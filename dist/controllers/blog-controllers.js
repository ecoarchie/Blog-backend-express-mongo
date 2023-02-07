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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const blogs_repository_1 = require("../repositories/blogs-repository");
const inversify_1 = require("inversify");
const blogs_queryRepository_1 = require("../repositories/queryRepositories/blogs.queryRepository");
let BlogsController = class BlogsController {
    constructor(blogsService, postsService, blogsRepository, blogsQueryRepository) {
        this.blogsService = blogsService;
        this.postsService = postsService;
        this.blogsRepository = blogsRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.getAllBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pageNumber = Number(req.query.pageNumber) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const skip = (pageNumber - 1) * pageSize;
            const blogsQueryParams = {
                searchNameTerm: req.query.searchNameTerm || null,
                pageNumber,
                pageSize,
                sortBy: ((_a = req.query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || 'createdAt',
                sortDirection: req.query.sortDirection || 'desc',
                skip,
            };
            const foundBlogs = yield this.blogsQueryRepository.getAllBlogs(blogsQueryParams);
            res.send(foundBlogs);
        });
        this.createBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newBlogId = yield this.blogsService.createBlog({
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            });
            const newBlog = yield this.blogsQueryRepository.getBlogById(newBlogId);
            res.status(201).send(newBlog);
        });
        this.createBlogPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlogById(req.params.blogId.toString());
            if (!blog) {
                res.sendStatus(404);
                return;
            }
            const postCreated = yield this.postsService.createBlogPost({
                blogId: blog.id,
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
            });
            res.status(201).send(postCreated);
        });
        this.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const blogFound = yield this.blogsQueryRepository.getBlogById(req.params.id.toString());
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
            var _b, _c;
            const blogId = req.params.blogId.toString();
            const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || '';
            const pageNumber = Number(req.query.pageNumber) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const skip = (pageNumber - 1) * pageSize;
            const postsQueryParams = {
                searchNameTerm: req.query.searchNameTerm || null,
                pageNumber,
                pageSize,
                sortBy: ((_c = req.query.sortBy) === null || _c === void 0 ? void 0 : _c.toString()) || 'createdAt',
                sortDirection: req.query.sortDirection || 'desc',
                skip,
            };
            const posts = yield this.blogsQueryRepository.getAllPostsByBlogId(blogId, userId, postsQueryParams);
            if (!posts)
                return res.sendStatus(404);
            res.send(posts);
        });
    }
};
BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blog_service_1.BlogsService)),
    __param(1, (0, inversify_1.inject)(post_service_1.PostsService)),
    __param(2, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(3, (0, inversify_1.inject)(blogs_queryRepository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blog_service_1.BlogsService,
        post_service_1.PostsService,
        blogs_repository_1.BlogsRepository,
        blogs_queryRepository_1.BlogsQueryRepository])
], BlogsController);
exports.BlogsController = BlogsController;
