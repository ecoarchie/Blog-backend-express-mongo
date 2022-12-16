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
let blogsDB = [
    {
        id: '1',
        name: 'blog1',
        description: 'desc1',
        websiteUrl: 'https://mail.ru',
    },
    {
        id: '2',
        name: 'blog2',
        description: 'desc2',
        websiteUrl: 'https://ya.ru',
    },
    {
        id: '3',
        name: 'blog3',
        description: 'desc3',
        websiteUrl: 'https://yahoo.com',
    },
];
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.find({}).toArray();
            // const blogs = blogsDB;
            // return blogs;
        });
    },
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            blogsDB = [];
            return blogsDB;
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
            };
            const result = yield db_1.blogsCollection.insertOne(newBlog);
            // blogsDB.push(newBlog);
            return newBlog;
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogById = blogsDB.find((b) => b.id === id);
            return blogById;
        });
    },
    updateBlogById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogToUpdate = blogsDB.find((b) => b.id === id);
            if (!blogToUpdate)
                return false;
            const blogIndexToChange = blogsDB.findIndex((b) => b.id === id);
            blogsDB[blogIndexToChange] = Object.assign(Object.assign({}, blogToUpdate), newDatajson);
            return true;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogToDelete = blogsDB.find((b) => b.id === id);
            if (!blogToDelete) {
                return false;
            }
            else {
                blogsDB = blogsDB.filter((b) => b.id !== id);
                return true;
            }
        });
    },
};
