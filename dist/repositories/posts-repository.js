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
exports.postsRepository = void 0;
const blogs_repository_1 = require("./blogs-repository");
const db_1 = require("./db");
exports.postsRepository = {
    findPosts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[options.sortBy] = options.sortDirection === 'asc' ? 1 : -1;
            const searchTerm = !options.searchNameTerm ? {} : { name: { $regex: options.searchNameTerm } };
            const pipeline = [
                { $match: searchTerm },
                { $sort: sort },
                { $skip: options.skip },
                { $limit: options.pageSize },
                { $project: { _id: 0 } },
            ];
            const posts = (yield db_1.postsCollection
                .aggregate(pipeline)
                .toArray());
            return posts;
        });
    },
    // async findPosts(): Promise<PostViewModel[]> {
    //   return await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
    // },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.deleteMany({});
        });
    },
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = data;
            const blog = (yield blogs_repository_1.blogsRepository.findBlogById(blogId));
            const blogName = blog.name;
            const newPost = {
                id: (+new Date()).toString(),
                title,
                shortDescription,
                content,
                blogId,
                blogName,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.postsCollection.insertOne(Object.assign({}, newPost));
            return newPost;
        });
    },
    createBlogPost(blogId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogPost = yield this.createPost(Object.assign({ blogId }, postData));
            return blogPost;
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ id }, { projection: { _id: 0 } });
            return post;
        });
    },
    updatePostById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id }, { $set: Object.assign({}, newDatajson) });
            return result.matchedCount === 1;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id });
            return result.deletedCount === 1;
        });
    },
    findPostsByBlogId(blogId, skip, limit, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
            const pipeline = [
                { $match: { blogId } },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                { $project: { _id: 0 } },
            ];
            const posts = (yield db_1.postsCollection
                .aggregate(pipeline)
                .toArray());
            return posts;
        });
    },
    countPostsByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.count({ blogId });
        });
    },
    countAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.countDocuments();
        });
    },
};
