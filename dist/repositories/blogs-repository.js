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
exports.blogsRepository = void 0;
const db_1 = require("./db");
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.deleteMany({});
        });
    },
    createBlog(bodyJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = bodyJson;
            const newBlog = {
                id: (+new Date()).toString(),
                name,
                description,
                websiteUrl,
                createdAt: new Date().toISOString(),
            };
            const result = yield db_1.blogsCollection.insertOne(Object.assign({}, newBlog));
            return newBlog;
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogById = yield db_1.blogsCollection.findOne({ id }, { projection: { _id: 0 } });
            console.log('blog: ', blogById);
            return blogById;
        });
    },
    updateBlogById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ id }, { $set: Object.assign({}, newDatajson) });
            return result.matchedCount === 1;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id });
            return result.deletedCount === 1;
        });
    },
};
