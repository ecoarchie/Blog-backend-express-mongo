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
exports.PostsService = void 0;
const inversify_1 = require("inversify");
const posts_repository_1 = require("../repositories/posts-repository");
let PostsService = class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
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
    // async countPostsByBlogId(blogId: string): Promise<number> {
    //   return this.postsRepository.countPostsByBlogId(blogId);
    // }
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
};
PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository])
], PostsService);
exports.PostsService = PostsService;
