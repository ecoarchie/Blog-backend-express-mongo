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
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.find({}).toArray();
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
            const newPost = {
                id: (+new Date()).toString(),
                title,
                shortDescription,
                content,
                blogId,
                blogName,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.postsCollection.insertOne(newPost);
            return newPost;
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
};
