"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
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
        const blogs = blogsDB;
        return blogs;
    },
    deleteAllBlogs() {
        blogsDB = [];
        return blogsDB;
    },
    createBlog(bodyJson) {
        const { name, description, websiteUrl } = bodyJson;
        const newBlog = {
            id: (+new Date()).toString(),
            name,
            description,
            websiteUrl,
        };
        blogsDB.push(newBlog);
        return newBlog;
    },
    findBlogById(id) {
        const blogById = blogsDB.find((b) => b.id === id);
        return blogById;
    },
    updateBlogById(id, newDatajson) {
        const blogToUpdate = blogsDB.find((b) => b.id === id);
        if (!blogToUpdate)
            return false;
        const blogIndexToChange = blogsDB.findIndex((b) => b.id === id);
        blogsDB[blogIndexToChange] = Object.assign(Object.assign({}, blogToUpdate), newDatajson);
        return true;
    },
    deleteBlogById(id) {
        const blogToDelete = blogsDB.find((b) => b.id === id);
        if (!blogToDelete) {
            return false;
        }
        else {
            blogsDB = blogsDB.filter((b) => b.id !== id);
            return true;
        }
    },
};
