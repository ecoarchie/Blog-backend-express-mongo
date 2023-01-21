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
const users_repository_1 = require("./users-repository");
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
            const commentsCount = yield db_1.commentsCollection.countDocuments({
                postId: new mongodb_1.ObjectId(postId),
            });
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
            const commentLikeResult = yield db_1.commentLikesCollection.insertOne({
                commentId: result.insertedId,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                },
            });
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
            yield db_1.commentLikesCollection.deleteMany({});
            yield db_1.userLikesCollection.deleteMany({});
            return db_1.commentsCollection.deleteMany({});
        });
    },
    _addToUsersLikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { likedComments: new mongodb_1.ObjectId(commentId) } });
        });
    },
    _removeFromUsersLikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $pull: { likedComments: new mongodb_1.ObjectId(commentId) } });
        });
    },
    _addToUsersDislikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { dislikedComments: new mongodb_1.ObjectId(commentId) } });
        });
    },
    _removeFromUsersDislikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $pull: { dislikedComments: new mongodb_1.ObjectId(commentId) } });
        });
    },
    likeComment(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedStatusBefore = yield users_repository_1.usersRepository.checkLikeStatus(userId, commentId);
            const likedField = likeStatus === 'Like' ? 'likesInfo.likesCount' : 'likesInfo.dislikesCount';
            if (likedStatusBefore === likeStatus) {
                return;
                //below is method when double like/dislike cancels first like/dislike.
                // await commentLikesCollection.updateOne(
                //   { commentId: new Object(commentId) },
                //   { $inc: { [likedField]: -1 } }
                // );
            }
            if (likedStatusBefore === 'None') {
                const likedUserField = likeStatus === 'Like' ? 'likedComments' : 'dislikedComments';
                yield db_1.commentLikesCollection.updateOne({ commentId: new mongodb_1.ObjectId(commentId) }, { $inc: { [likedField]: 1 } });
                yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { [likedUserField]: new mongodb_1.ObjectId(commentId) } });
            }
            else if (likedStatusBefore === 'Like') {
                // so likeStatus === 'Dislike'
                yield db_1.commentLikesCollection.updateOne({ commentId: new mongodb_1.ObjectId(commentId) }, { $inc: { 'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1 } });
                yield this._removeFromUsersLikeList(userId, commentId);
                yield this._addToUsersDislikeList(userId, commentId);
            }
            else if (likedStatusBefore === 'Dislike') {
                // so likeStatus === 'Like'
                yield db_1.commentLikesCollection.updateOne({ commentId: new mongodb_1.ObjectId(commentId) }, { $inc: { 'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1 } });
                yield this._addToUsersLikeList(userId, commentId);
                yield this._removeFromUsersDislikeList(userId, commentId);
            }
        });
    },
};
