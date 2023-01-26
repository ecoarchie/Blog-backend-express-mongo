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
    getCommentById(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(commentId))
                return null;
            const commentFound = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(commentId) });
            let commentView = null;
            if (commentFound) {
                const likesInfo = yield db_1.commentLikesCollection.findOne({
                    commentId: new mongodb_1.ObjectId(commentId),
                });
                let userLikesDislikes;
                if (!userId) {
                    console.log('🚀 ~ file: comments-repository.ts:19 ~ getCommentById ~ userId', userId);
                    userLikesDislikes = null;
                }
                else {
                    userLikesDislikes = yield db_1.userLikesCollection.findOne({
                        userId: new mongodb_1.ObjectId(userId),
                    });
                    console.log('🚀 ~ file: comments-repository.ts:24 ~ getCommentById ~ userLikesDislikes', userLikesDislikes);
                }
                let myStatus;
                if (!(userLikesDislikes === null || userLikesDislikes === void 0 ? void 0 : userLikesDislikes.likedComments.includes(commentId)) &&
                    !(userLikesDislikes === null || userLikesDislikes === void 0 ? void 0 : userLikesDislikes.dislikedComments.includes(commentId))) {
                    myStatus = 'None';
                }
                else {
                    if (userLikesDislikes.likedComments.includes(commentId)) {
                        myStatus = 'Like';
                    }
                    else if (userLikesDislikes.dislikedComments.includes(commentId)) {
                        myStatus = 'Dislike';
                    }
                    else {
                        myStatus = 'None';
                    }
                }
                commentView = {
                    id: commentFound._id.toString(),
                    content: commentFound.content,
                    createdAt: commentFound.createdAt,
                    likesInfo: Object.assign(Object.assign({}, likesInfo.likesInfo), { myStatus: myStatus }),
                    commentatorInfo: {
                        userId: commentFound.commentatorInfo.userId.toString(),
                        userLogin: commentFound.commentatorInfo.userLogin,
                    },
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
            //TODO delete comment mentions from all users likes, also delete comment likes
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
                {
                    $lookup: {
                        from: 'commentLikes',
                        localField: '_id',
                        foreignField: 'commentId',
                        as: 'likesInfo',
                    },
                },
                { $project: { _id: 0, postId: 0, 'likesInfo._id': 0, 'likesInfo.commentId': 0 } },
            ];
            const comments = (yield db_1.commentsCollection.aggregate(pipeline).toArray()).map((comment) => {
                var _a;
                comment.id = comment.id.toString();
                comment.commentatorInfo.userId = comment.commentatorInfo.userId.toString();
                comment.likesInfo = ((_a = comment.likesInfo[0]) === null || _a === void 0 ? void 0 : _a.likesInfo) || {
                    likesCount: 0,
                    dislikesCount: 0,
                };
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
                commentatorInfo: {
                    userId: new mongodb_1.ObjectId(commentData.commentatorInfo.userId),
                    userLogin: commentData.commentatorInfo.userLogin,
                },
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
                commentatorInfo: {
                    userId: commentData.commentatorInfo.userId,
                    userLogin: commentData.commentatorInfo.userLogin,
                },
                createdAt: commentData.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            };
            return newComment;
        });
    },
    deleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentLikesCollection.deleteMany({});
            //TODO now it deletes whole userLikes collection, along with posts likes. Rewrite
            yield db_1.userLikesCollection.deleteMany({});
            return db_1.commentsCollection.deleteMany({});
        });
    },
    _addToUsersLikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { likedComments: commentId } });
        });
    },
    _removeFromUsersLikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $pull: { likedComments: commentId } });
        });
    },
    _addToUsersDislikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { dislikedComments: commentId } });
        });
    },
    _removeFromUsersDislikeList(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $pull: { dislikedComments: commentId } });
        });
    },
    likeComment(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedStatusBefore = yield users_repository_1.usersRepository.checkLikeStatus(userId, commentId);
            if (likeStatus === 'None') {
                if (likedStatusBefore === 'Like') {
                    yield db_1.commentLikesCollection.updateOne({ commentId: new mongodb_1.ObjectId(commentId) }, { $inc: { 'likesInfo.likesCount': -1 } });
                    yield this._removeFromUsersLikeList(userId, commentId);
                }
                else if (likedStatusBefore === 'Dislike') {
                    yield db_1.commentLikesCollection.updateOne({ commentId: new mongodb_1.ObjectId(commentId) }, { $inc: { 'likesInfo.dislikesCount': -1 } });
                    yield this._removeFromUsersDislikeList(userId, commentId);
                }
                return;
            }
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
                yield db_1.userLikesCollection.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $push: { [likedUserField]: commentId } });
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
