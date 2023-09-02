"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtVerifier_1 = __importDefault(require("../middlewares/jwtVerifier"));
const authController_1 = require("../controllers/authController");
const authRouter = express_1.default.Router();
authRouter.get('/', jwtVerifier_1.default, authController_1.authenticateUser);
authRouter.post('/login/admin', authController_1.adminLogin);
exports.default = authRouter;
