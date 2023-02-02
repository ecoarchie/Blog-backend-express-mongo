"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.BlogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
const users_repository_1 = require("./users-repository");
const inversify_1 = require("inversify");
let BlogsRepository = class BlogsRepository {
    findBlogs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[options.sortBy] = options.sortDirection === 'asc' ? 1 : -1;
            const searchTerm = !options.searchNameTerm
                ? {}
                : { name: { $regex: options.searchNameTerm, $options: 'i' } };
            const pipeline = [
                { $match: searchTerm },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: options.skip },
                { $limit: options.pageSize },
                { $project: { _id: 0 } },
            ];
            const blogs = (yield db_1.blogsCollection.aggregate(pipeline).toArray()).map((blog) => {
                blog.id = blog.id.toString();
                return blog;
            });
            return blogs;
        });
    }
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.deleteMany({});
        });
    }
    createBlog(blogToInsert) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.insertOne(blogToInsert);
            const newBlog = {
                id: result.insertedId.toString(),
                name: blogToInsert.name,
                description: blogToInsert.description,
                websiteUrl: blogToInsert.websiteUrl,
                createdAt: blogToInsert.createdAt,
            };
            return newBlog;
        });
    }
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return null;
            const blogById = yield db_1.blogsCollection.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            let blogToReturn = null;
            if (blogById) {
                const { _id, name, description, websiteUrl, createdAt } = blogById;
                blogToReturn = { id: _id.toString(), name, description, websiteUrl, createdAt };
            }
            return blogToReturn;
        });
    }
    updateBlogById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return false;
            const result = yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, newDatajson) });
            yield updatePostsForUpdatedBlog();
            return result.matchedCount === 1;
            function updatePostsForUpdatedBlog() {
                return __awaiter(this, void 0, void 0, function* () {
                    const { name } = newDatajson;
                    if (name) {
                        yield db_1.postsCollection.updateMany({ blogId: new mongodb_1.ObjectId(id) }, { $set: { blogName: name } });
                    }
                });
            }
        });
    }
    findPostsByBlogId(blogId, skip, limit, sortBy, sortDirection, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
            const pipeline = [
                { $match: { blogId: new mongodb_1.ObjectId(blogId) } },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                { $project: { _id: 0 } },
            ];
            const postsLikesInfo = yield db_1.postLikesCollection.find().toArray();
            yield Promise.all(postsLikesInfo.map((p) => __awaiter(this, void 0, void 0, function* () {
                p.myStatus = yield users_repository_1.usersRepository.checkLikeStatus(userId, {
                    field: 'Posts',
                    fieldId: p.postId.toString(),
                });
                return p;
            })));
            const posts = (yield db_1.postsCollection.aggregate(pipeline).toArray()).map((post) => {
                post.id = post.id.toString();
                post.blogId = post.blogId.toString();
                let extendedLikesInfo = postsLikesInfo.find((p) => p.postId.toString() === post.id);
                post.extendedLikesInfo = {
                    likesCount: extendedLikesInfo.likesCount,
                    dislikesCount: extendedLikesInfo.dislikesCount,
                    myStatus: extendedLikesInfo.myStatus,
                    newestLikes: extendedLikesInfo.newestLikes.slice(0, 3),
                };
                return post;
            });
            return posts;
        });
    }
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return false;
            const result = yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    }
    countAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.blogsCollection.countDocuments();
        });
    }
};
BlogsRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsRepository);
exports.BlogsRepository = BlogsRepository;
