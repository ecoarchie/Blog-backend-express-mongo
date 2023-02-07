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
exports.PostsQueryRepository = void 0;
const bson_1 = require("bson");
const inversify_1 = require("inversify");
const blogs_repository_1 = require("../blogs-repository");
const db_1 = require("../db");
const blogs_queryRepository_1 = require("../queryRepositories/blogs.queryRepository");
const users_repository_1 = require("../users-repository");
let PostsQueryRepository = class PostsQueryRepository {
    constructor(blogsRepository, blogsQueryRepository) {
        this.blogsRepository = blogsRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    getAllPosts(options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[options.sortBy] = options.sortDirection === 'asc' ? 1 : -1;
            const searchTerm = !options.searchNameTerm
                ? {}
                : { name: { $regex: options.searchNameTerm } };
            const pipeline = [
                { $match: searchTerm },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: options.skip },
                { $limit: options.pageSize },
                { $project: { _id: 0 } },
            ];
            const posts = (yield db_1.postsCollection
                .aggregate(pipeline)
                .toArray());
            const postsLikesInfo = yield db_1.postLikesCollection.find().toArray();
            yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                let extendedLikesInfo = postsLikesInfo.find((p) => p.postId.toString() === post.id.toString());
                post.extendedLikesInfo = {
                    likesCount: extendedLikesInfo.likesCount,
                    dislikesCount: extendedLikesInfo.dislikesCount,
                    myStatus: yield users_repository_1.usersRepository.checkLikeStatus(userId, {
                        field: 'Posts',
                        fieldId: post.id.toString(),
                    }),
                    newestLikes: extendedLikesInfo.newestLikes.slice(0, 3),
                };
                return post;
            })));
            const totalCount = options.searchNameTerm
                ? posts.length
                : yield this.countAllPosts();
            const pagesCount = Math.ceil(totalCount / options.pageSize);
            return {
                pagesCount,
                page: options.pageNumber,
                pageSize: options.pageSize,
                totalCount,
                items: posts,
            };
        });
    }
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(postId))
                return null;
            const postById = yield db_1.postsCollection.findOne({ _id: new bson_1.ObjectId(postId) });
            let postToReturn = null;
            if (postById) {
                const { _id, title, shortDescription, content, blogId, blogName, createdAt } = postById;
                const postLikesInfo = yield db_1.postLikesCollection.findOne({ postId: new bson_1.ObjectId(postId) }, { projection: { _id: 0 } });
                const myStatus = yield users_repository_1.usersRepository.checkLikeStatus(userId, {
                    field: 'Posts',
                    fieldId: postId,
                });
                postToReturn = {
                    id: _id.toString(),
                    title,
                    shortDescription,
                    content,
                    blogId: blogId.toString(),
                    blogName,
                    createdAt,
                    extendedLikesInfo: {
                        likesCount: postLikesInfo.likesCount,
                        dislikesCount: postLikesInfo.dislikesCount,
                        newestLikes: postLikesInfo.newestLikes.slice(0, 3),
                        myStatus,
                    },
                };
            }
            return postToReturn;
        });
    }
    countAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.countDocuments();
        });
    }
    isPostExist(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(postId))
                return false;
            return (yield db_1.postsCollection.countDocuments({ _id: new bson_1.ObjectId(postId) })) > 0;
        });
    }
};
PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(blogs_queryRepository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        blogs_queryRepository_1.BlogsQueryRepository])
], PostsQueryRepository);
exports.PostsQueryRepository = PostsQueryRepository;
