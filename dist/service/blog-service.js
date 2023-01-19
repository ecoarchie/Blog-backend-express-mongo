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
exports.blogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs-repository");
class BlogService {
    findBlogs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.findBlogs(options);
        });
    }
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.deleteAllBlogs();
        });
    }
    createBlog(bodyJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = bodyJson;
            const blogToInsert = {
                name,
                description,
                websiteUrl,
                createdAt: new Date().toISOString(),
            };
            const createdBlog = yield blogs_repository_1.blogsRepository.createBlog(blogToInsert);
            return createdBlog;
        });
    }
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.findBlogById(id);
        });
    }
    updateBlogById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.updateBlogById(id, newDatajson);
        });
    }
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.deleteBlogById(id);
        });
    }
    countAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.countAllBlogs();
        });
    }
}
exports.blogsService = new BlogService();
