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
let postsDB = [
    {
        id: '1',
        title: 'Post 1',
        shortDescription: 'Description 1',
        content: 'Content of post 1',
        blogId: '1',
        blogName: 'Blog 1',
    },
    {
        id: '2',
        title: 'Post 2',
        shortDescription: 'Description 2',
        content: 'Content of post 2',
        blogId: '2',
        blogName: 'Blog 2',
    },
    {
        id: '3',
        title: 'Post 3',
        shortDescription: 'Description 3',
        content: 'Content of post 3',
        blogId: '1',
        blogName: 'Blog 1',
    },
];
exports.postsRepository = {
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return postsDB;
        });
    },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            postsDB = [];
            return postsDB;
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
            };
            postsDB.push(newPost);
            return newPost;
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = postsDB.find((p) => p.id === id);
            return post;
        });
    },
    updatePostById(id, newDatajson) {
        return __awaiter(this, void 0, void 0, function* () {
            const postToUpdate = postsDB.find((p) => p.id === id);
            if (!postToUpdate)
                return false;
            const postIndexToChange = postsDB.findIndex((p) => p.id === id);
            postsDB[postIndexToChange] = Object.assign(Object.assign({}, postToUpdate), newDatajson);
            return true;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postToDelete = postsDB.find((p) => p.id === id);
            if (!postToDelete) {
                return false;
            }
            else {
                postsDB = postsDB.filter((p) => p.id !== id);
                return true;
            }
        });
    },
};
