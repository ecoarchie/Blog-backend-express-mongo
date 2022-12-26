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
exports.runDb = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db('blogposts');
exports.blogsCollection = db.collection('blogs');
exports.postsCollection = db.collection('posts');
exports.usersCollection = db.collection('users');
exports.commentsCollection = db.collection('comments');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db('blogposts').command({ ping: 1 });
            console.log('Connected successfully to Mongo Server');
        }
        catch (_a) {
            console.log('Cannot connect to db');
            yield client.close();
        }
    });
}
exports.runDb = runDb;
