"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setQueryParams = void 0;
const setQueryParams = (query) => {
    var _a;
    const searchNameTerm = query.searchNameTerm || null;
    const pageNumber = Number(query.pageNumber) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const sortBy = ((_a = query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || 'createdAt';
    const sortDirection = query.sortDirection || 'desc';
    const skip = (pageNumber - 1) * pageSize;
    return { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection, skip };
};
exports.setQueryParams = setQueryParams;
