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
const inversify_1 = require("inversify");
let BlogsRepository = class BlogsRepository {
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.deleteMany({});
        });
    }
    createBlog(blogToInsert) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.insertOne(blogToInsert);
            return result.insertedId.toString();
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
