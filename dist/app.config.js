"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const blog_routers_1 = require("./routes/blog-routers");
const post_routers_1 = require("./routes/post-routers");
const user_routes_1 = require("./routes/user-routes");
const blogs_repository_1 = require("./repositories/blogs-repository");
const posts_repository_1 = require("./repositories/posts-repository");
const users_repository_1 = require("./repositories/users-repository");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.app = (0, express_1.default)();
exports.port = process.env.PORT;
exports.app.use(body_parser_1.default.json());
exports.app.use('/blogs', blog_routers_1.blogRouter);
exports.app.use('/posts', post_routers_1.postRouter);
exports.app.use('/users', user_routes_1.userRouter);
exports.app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World!');
}));
exports.app.post('/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPassword = req.body.password;
    const userLoginOrEmail = req.body.loginOrEmail;
    const userPasswordInDB = 'qwerty1';
    const userLoginInDB = 'lg-465115';
    const hash = yield bcrypt_1.default.hash(userPassword, 1);
    const match = yield bcrypt_1.default.compare(userPasswordInDB, hash);
    if (match && userLoginOrEmail === userLoginInDB) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(401);
    }
}));
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    blogs_repository_1.blogsRepository.deleteAllBlogs();
    posts_repository_1.postsRepository.deleteAllPosts();
    users_repository_1.usersRepository.deleteAllUsers();
    res.sendStatus(204);
}));
