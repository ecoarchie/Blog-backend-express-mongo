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
exports.BlogsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require(".././db");
const users_repository_1 = require(".././users-repository");
const inversify_1 = require("inversify");
let BlogsQueryRepository = class BlogsQueryRepository {
    getAllBlogs(blogsQueryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[blogsQueryParams.sortBy] = blogsQueryParams.sortDirection === 'asc' ? 1 : -1;
            const searchTerm = !blogsQueryParams.searchNameTerm
                ? {}
                : { name: { $regex: blogsQueryParams.searchNameTerm, $options: 'i' } };
            const pipeline = [
                { $match: searchTerm },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: blogsQueryParams.skip },
                { $limit: blogsQueryParams.pageSize },
                { $project: { _id: 0 } },
            ];
            const blogs = (yield db_1.blogsCollection.aggregate(pipeline).toArray()).map((blog) => {
                blog.id = blog.id.toString();
                return blog;
            });
            const totalCount = blogsQueryParams.searchNameTerm
                ? blogs.length
                : yield this.countAllBlogs();
            const pagesCount = Math.ceil(totalCount / blogsQueryParams.pageSize);
            return {
                pagesCount,
                page: blogsQueryParams.pageNumber,
                pageSize: blogsQueryParams.pageSize,
                totalCount,
                items: blogs,
            };
        });
    }
    getBlogById(id) {
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
    countPostsByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.count({ blogId: new mongodb_1.ObjectId(blogId) });
        });
    }
    getAllPostsByBlogId(blogId, userId, postsQueryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(blogId))
                return null;
            const totalCount = yield this.countPostsByBlogId(blogId);
            const pagesCount = Math.ceil(totalCount / postsQueryParams.pageSize);
            const sort = {};
            sort[postsQueryParams.sortBy] = postsQueryParams.sortDirection === 'asc' ? 1 : -1;
            const pipeline = [
                { $match: { blogId: new mongodb_1.ObjectId(blogId) } },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: postsQueryParams.skip },
                { $limit: postsQueryParams.pageSize },
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
            return posts.length > 0
                ? {
                    pagesCount,
                    page: postsQueryParams.pageNumber,
                    pageSize: postsQueryParams.pageSize,
                    totalCount,
                    items: posts,
                }
                : null;
        });
    }
    countAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.blogsCollection.countDocuments();
        });
    }
};
BlogsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsQueryRepository);
exports.BlogsQueryRepository = BlogsQueryRepository;
