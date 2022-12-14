"use strict";
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
        return postsDB;
    },
    createPost(data) {
        const { title, shortDescription, content, blogId } = data;
        const blog = blogs_repository_1.blogsRepository.findBlogById(blogId);
        //@ts-ignore: blog id is validated by middleware, so it is not undefined
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
    },
};
