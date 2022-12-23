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
exports.postsRepository = void 0;
const bson_1 = require("bson");
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
                { $addFields: { id: '$_id' } },
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
            const postToInsert = {
                _id: null,
                title,
                shortDescription,
                content,
                blogId: new bson_1.ObjectID(blogId),
                blogName,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.postsCollection.insertOne(postToInsert);
            const newPost = {
                id: result.insertedId.toString(),
                title: postToInsert.title,
                shortDescription: postToInsert.shortDescription,
                content: postToInsert.content,
                blogId: blogId,
                blogName: postToInsert.blogName,
                createdAt: postToInsert.createdAt,
            };
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
            if (!bson_1.ObjectId.isValid(id))
                return null;
            const postById = yield db_1.postsCollection.findOne({ _id: new bson_1.ObjectId(id) });
            let postToReturn = null;
            if (postById) {
                const { _id, blogId } = postById, rest = __rest(postById, ["_id", "blogId"]);
                postToReturn = Object.assign({ id: _id.toString(), blogId: blogId.toString() }, rest);
            }
            return postToReturn;
        });
    },
    updatePostById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(id))
                return false;
            const { blogId } = newDatajson, rest = __rest(newDatajson, ["blogId"]);
            const result = yield db_1.postsCollection.updateOne({ _id: new bson_1.ObjectId(id), blogId: new bson_1.ObjectId(blogId) }, { $set: Object.assign({}, rest) });
            return result.matchedCount === 1;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bson_1.ObjectId.isValid(id))
                return false;
            const result = yield db_1.postsCollection.deleteOne({ _id: new bson_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    findPostsByBlogId(blogId, skip, limit, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
            const pipeline = [
                { $match: { blogId: new bson_1.ObjectId(blogId) } },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                { $project: { _id: 0 } },
            ];
            const posts = (yield db_1.postsCollection.aggregate(pipeline).toArray()).map((post) => {
                post.id = post.id.toString();
                post.blogId = post.blogId.toString();
                return post;
            });
            return posts;
        });
    },
    countPostsByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.count({ blogId: new bson_1.ObjectId(blogId) });
        });
    },
    countAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.countDocuments();
        });
    },
};
