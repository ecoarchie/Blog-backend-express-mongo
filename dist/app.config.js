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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const blog_routers_1 = require("./routes/blog-routers");
const post_routers_1 = require("./routes/post-routers");
const user_routes_1 = require("./routes/user-routes");
const blogs_repository_1 = require("./repositories/blogs-repository");
const posts_repository_1 = require("./repositories/posts-repository");
const users_repository_1 = require("./repositories/users-repository");
const dotenv = __importStar(require("dotenv"));
const commets_routers_1 = require("./routes/commets-routers");
const auth_routers_1 = require("./routes/auth-routers");
const comments_repository_1 = require("./repositories/comments-repository");
const session_routers_1 = require("./routes/session-routers");
const express_useragent_1 = __importDefault(require("express-useragent"));
const session_service_1 = require("./application/session-service");
dotenv.config();
exports.app = (0, express_1.default)();
exports.port = process.env.PORT;
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.use(express_useragent_1.default.express());
exports.app.use((0, morgan_1.default)('tiny'));
exports.app.set('trust proxy', true);
exports.app.use('/blogs', blog_routers_1.blogRouter);
exports.app.use('/posts', post_routers_1.postRouter);
exports.app.use('/users', user_routes_1.userRouter);
exports.app.use('/comments', commets_routers_1.commentRouter);
exports.app.use('/auth', auth_routers_1.authRouter);
exports.app.use('/security/devices', session_routers_1.sessionRouter);
exports.app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World!');
}));
const blogsRepository = new blogs_repository_1.BlogsRepository();
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogsRepository.deleteAllBlogs();
    yield posts_repository_1.postsRepository.deleteAllPosts();
    yield users_repository_1.usersRepository.deleteAllUsers();
    yield comments_repository_1.commentRepository.deleteAllComments();
    yield session_service_1.sessionService.deleteAllSessions();
    yield posts_repository_1.postsRepository.deleteAllPostsLikes();
    res.sendStatus(204);
    return;
}));
