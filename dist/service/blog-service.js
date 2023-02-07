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
exports.BlogsService = void 0;
const inversify_1 = require("inversify");
const blogs_repository_1 = require("../repositories/blogs-repository");
let BlogsService = class BlogsService {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.deleteAllBlogs();
        });
    }
    createBlog(blogInputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = blogInputData;
            const blogToInsert = {
                name,
                description,
                websiteUrl,
                createdAt: new Date().toISOString(),
            };
            const createdBlogId = yield this.blogsRepository.createBlog(blogToInsert);
            return createdBlogId;
        });
    }
    updateBlogById(id, blogUpdateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.updateBlogById(id, blogUpdateData);
        });
    }
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.deleteBlogById(id);
        });
    }
    countAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.countAllBlogs();
        });
    }
};
BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], BlogsService);
exports.BlogsService = BlogsService;
