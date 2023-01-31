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
exports.BlogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs-repository");
class BlogsService {
    constructor() {
        this.blogsRepository = new blogs_repository_1.BlogsRepository();
    }
    // async findBlogs(options: BlogReqQueryModel): Promise<BlogViewModel[]> {
    //   return this.blogsRepository.findBlogs(options);
    // }
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.deleteAllBlogs();
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
            const createdBlog = yield this.blogsRepository.createBlog(blogToInsert);
            return createdBlog;
        });
    }
    // async findBlogById(id: string): Promise<BlogViewModel | null> {
    //   return this.blogsRepository.findBlogById(id);
    // }
    updateBlogById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.updateBlogById(id, newDatajson);
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
}
exports.BlogsService = BlogsService;
// export const blogsService = new BlogsService();
