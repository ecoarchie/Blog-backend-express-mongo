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
    static deleteAllPostsLikes() {
        throw new Error('Method not implemented.');
    }
    constructor() {
        this.postsRepository = new posts_repository_1.PostsRepository();
    }
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.deleteAllPosts();
        });
    }
    deleteAllPostsLikes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.deleteAllPostsLikes();
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
    likePostService(userId, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsRepository.getPostById(postId, userId);
            if (!foundPost)
                return 404;
            try {
                const likePost = yield this.postsRepository.likePost(userId, postId, likeStatus);
                return 204;
            }
            catch (error) {
                console.error(error);
                return 404;
            }
        });
    }
}
exports.PostsService = PostsService;
