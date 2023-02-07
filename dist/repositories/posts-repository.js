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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepository = void 0;
const bson_1 = require("bson");
const inversify_1 = require("inversify");
const blogs_repository_1 = require("./blogs-repository");
const db_1 = require("./db");
const blogs_queryRepository_1 = require("./queryRepositories/blogs.queryRepository");
const users_repository_1 = require("./users-repository");
let PostsRepository = class PostsRepository {
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
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.deleteMany({});
        });
    }
    deleteAllPostsLikes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postLikesCollection.deleteMany({});
        });
    }
    createPost(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = data;
            const blog = (yield this.blogsQueryRepository.getBlogById(blogId));
            const blogName = blog.name;
            const postToInsert = {
                title,
                shortDescription,
                content,
                blogId: new bson_1.ObjectID(blogId),
                blogName,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.postsCollection.insertOne(postToInsert);
            if (result.insertedId) {
                db_1.postLikesCollection.insertOne({
                    postId: result.insertedId,
                    likesCount: 0,
                    dislikesCount: 0,
                    newestLikes: [],
                });
            }
            const newPost = {
                id: result.insertedId.toString(),
                title: postToInsert.title,
                shortDescription: postToInsert.shortDescription,
                content: postToInsert.content,
                blogId: blogId,
                blogName: postToInsert.blogName,
                createdAt: postToInsert.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: [],
                },
            };
            return (_a = result.insertedId) === null || _a === void 0 ? void 0 : _a.toString();
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
    updatePostById(postId, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(postId))
                return false;
            const { blogId } = updateParams, rest = __rest(updateParams, ["blogId"]);
            const result = yield db_1.postsCollection.updateOne({ _id: new bson_1.ObjectId(postId), blogId: new bson_1.ObjectId(blogId) }, { $set: Object.assign({}, rest) });
            return result.matchedCount === 1;
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(postId))
                return false;
            const result = yield db_1.postsCollection.deleteOne({ _id: new bson_1.ObjectId(postId) });
            return result.deletedCount === 1;
        });
    }
    // async countPostsByBlogId(blogId: string): Promise<number> {
    //   return postsCollection.count({ blogId: new ObjectId(blogId) });
    // }
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
    _addToUsersLikeList(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new bson_1.ObjectId(userId) }, { $push: { likedPosts: postId } });
        });
    }
    _removeFromUsersLikeList(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new bson_1.ObjectId(userId) }, { $pull: { likedPosts: postId } });
        });
    }
    _addToUsersDislikeList(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new bson_1.ObjectId(userId) }, { $push: { dislikedPosts: postId } });
        });
    }
    _removeFromUsersDislikeList(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new bson_1.ObjectId(userId) }, { $pull: { dislikedPosts: postId } });
        });
    }
    _addUserToNewestLikes(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield users_repository_1.usersRepository.findUserById(userId);
            const newestLiked = {
                addedAt: new Date().toISOString(),
                userId,
                login: foundUser.login,
            };
            const newestLikesToUpdate = yield db_1.postLikesCollection.findOne({
                postId: new bson_1.ObjectId(postId),
            });
            const newestLikesArray = newestLikesToUpdate.newestLikes;
            const alreadyLiked = newestLikesArray.find((p) => p.userId === userId);
            if (!alreadyLiked)
                newestLikesArray.unshift(newestLiked);
            const result = yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $set: { newestLikes: newestLikesArray } });
        });
    }
    _removeFromNewestLikes(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $pull: { newestLikes: { userId } } });
        });
    }
    likePost(userId, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedStatusBefore = yield users_repository_1.usersRepository.checkLikeStatus(userId, {
                field: 'Posts',
                fieldId: postId,
            });
            if (likedStatusBefore === likeStatus)
                return;
            if (likeStatus === 'None') {
                if (likedStatusBefore === 'Like') {
                    yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $inc: { likesCount: -1 } });
                    yield this._removeFromUsersLikeList(userId, postId);
                }
                else if (likedStatusBefore === 'Dislike') {
                    yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $inc: { dislikesCount: -1 } });
                    yield this._removeFromUsersDislikeList(userId, postId);
                }
                return;
            }
            const likedField = likeStatus === 'Like' ? 'likesCount' : 'dislikesCount';
            if (likedStatusBefore === 'None') {
                const likedUserField = likeStatus === 'Like' ? 'likedPosts' : 'dislikedPosts';
                yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $inc: { [likedField]: 1 } });
                yield db_1.userLikesCollection.updateOne({ userId: new bson_1.ObjectId(userId) }, { $push: { [likedUserField]: postId } });
                if (likeStatus === 'Like') {
                    yield this._addUserToNewestLikes(userId, postId);
                }
                else {
                    yield this._removeFromNewestLikes(userId, postId);
                }
            }
            else if (likedStatusBefore === 'Like') {
                // so likeStatus === 'Dislike'
                yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $inc: { likesCount: -1, dislikesCount: 1 } });
                yield this._removeFromUsersLikeList(userId, postId);
                yield this._addToUsersDislikeList(userId, postId);
                yield this._removeFromNewestLikes(userId, postId);
            }
            else if (likedStatusBefore === 'Dislike') {
                // so likeStatus === 'Like'
                yield db_1.postLikesCollection.updateOne({ postId: new bson_1.ObjectId(postId) }, { $inc: { likesCount: 1, dislikesCount: -1 } });
                yield this._addToUsersLikeList(userId, postId);
                yield this._removeFromUsersDislikeList(userId, postId);
                yield this._addUserToNewestLikes(userId, postId);
            }
        });
    }
};
PostsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(blogs_queryRepository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        blogs_queryRepository_1.BlogsQueryRepository])
], PostsRepository);
exports.PostsRepository = PostsRepository;
