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
exports.blogsRepository = exports.BlogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
class BlogsRepository {
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
            const { name } = newDatajson;
            yield updatePostsForUpdatedBlog();
            return result.matchedCount === 1;
            function updatePostsForUpdatedBlog() {
                return __awaiter(this, void 0, void 0, function* () {
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
}
exports.BlogsRepository = BlogsRepository;
exports.blogsRepository = new BlogsRepository();
