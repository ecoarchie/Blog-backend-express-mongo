"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const session_controllers_1 = require("../controllers/session-controllers");
exports.sessionRouter = (0, express_1.Router)();
exports.sessionRouter.get('/', session_controllers_1.getActiveSessionsController);
exports.sessionRouter.delete('/', session_controllers_1.deleteRestSessionsController);
exports.sessionRouter.delete('/:deviceId', session_controllers_1.deleteDeviceSessionController);
