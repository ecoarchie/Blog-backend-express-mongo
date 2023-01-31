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
exports.PostsService = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
class PostsService {
    constructor() {
        this.postsRepository = new posts_repository_1.PostsRepository();
    }
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.deleteAllPosts();
        });
    }
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.createPost(data);
        });
    }
    createBlogPost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogPost = yield this.createPost(Object.assign({}, postData));
            return blogPost;
        });
    }
    updatePostById(postId, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.updatePostById(postId, updateParams);
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.deletePostById(postId);
        });
    }
    countPostsByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.countPostsByBlogId(blogId);
        });
    }
    countAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.countAllPosts();
        });
    }
}
exports.PostsService = PostsService;
