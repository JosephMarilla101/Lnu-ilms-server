"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtVerifier_1 = __importDefault(require("../middlewares/jwtVerifier"));
const authorController_1 = require("../controllers/authorController");
const authorRouter = express_1.default.Router();
authorRouter.get('/all', jwtVerifier_1.default, authorController_1.getALLAuthors);
authorRouter.post('/', jwtVerifier_1.default, authorController_1.createAuthor);
exports.default = authorRouter;
