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
exports.commentRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.commentRepository = {
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id))
                return null;
            const commentFound = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            let commentView = null;
            if (commentFound) {
                commentView = {
                    id: commentFound._id.toString(),
                    content: commentFound.content,
                    userId: commentFound.userId.toString(),
                    userLogin: commentFound.userLogin,
                    createdAt: commentFound.createdAt,
                };
            }
            return commentView;
        });
    },
    updateCommentById(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { content } });
            return result.matchedCount === 1;
        });
    },
    deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    getCommentsByPostId(postId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = {};
            sort[options.sortBy] = options.sortDirection === 'asc' ? 1 : -1;
            const pipeline = [
                { $match: { postId: new mongodb_1.ObjectId(postId) } },
                { $addFields: { id: '$_id' } },
                { $sort: sort },
                { $skip: options.skip },
                { $limit: options.pageSize },
                { $project: { _id: 0, postId: 0 } },
            ];
            const comments = (yield db_1.commentsCollection.aggregate(pipeline).toArray()).map((comment) => {
                comment.id = comment.id.toString();
                comment.userId = comment.userId.toString();
                return comment;
            });
            return comments;
        });
    },
    countAllCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsCount = yield db_1.commentsCollection.countDocuments({ postId: new mongodb_1.ObjectId(postId) });
            return commentsCount;
        });
    },
    createComment(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = {
                postId: new mongodb_1.ObjectId(commentData.postId),
                content: commentData.content,
                userId: new mongodb_1.ObjectId(commentData.userId),
                userLogin: commentData.userLogin,
                createdAt: commentData.createdAt,
            };
            const result = yield db_1.commentsCollection.insertOne(comment);
            const newComment = {
                id: result.insertedId.toString(),
                content: commentData.content,
                userId: commentData.userId,
                userLogin: commentData.userLogin,
                createdAt: commentData.createdAt,
            };
            return newComment;
        });
    },
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.commentsCollection.deleteMany({});
        });
    },
};
