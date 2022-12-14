"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const blog_routers_1 = require("./routes/blog-routers");
const blogs_repository_1 = require("./repositories/blogs-repository");
const post_routers_1 = require("./routes/post-routers");
exports.app = (0, express_1.default)();
const port = 5000;
exports.app.use(body_parser_1.default.json());
exports.app.use('/blogs', blog_routers_1.blogRouter);
exports.app.use('/posts', post_routers_1.postRouter);
exports.app.get('/', (req, res) => {
    res.send('Hello World!');
});
exports.app.delete('/testing/all-data', (req, res) => {
    blogs_repository_1.blogsRepository.deleteAllBlogs();
    res.sendStatus(204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
