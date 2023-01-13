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
exports.sessionService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../repositories/db");
exports.sessionService = {
    addSession(deviceId, lastActiveDate, tokenExpireDate, ip, title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionObj = {
                ip,
                title,
                lastActiveDate,
                deviceId,
                tokenExpireDate,
                userId: new mongodb_1.ObjectId(userId),
            };
            const result = yield db_1.userSessionCollection.insertOne(sessionObj);
        });
    },
    updateSession(newSession) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.userSessionCollection.updateOne({ _id: newSession._id }, {
                $set: {
                    lastActiveDate: newSession.lastActiveDate,
                    tokenExpireDate: newSession.tokenExpireDate,
                    ip: newSession.ip,
                    title: newSession.title,
                },
            }, { upsert: true });
        });
    },
    deleteAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.userSessionCollection.deleteMany({});
        });
    },
};
