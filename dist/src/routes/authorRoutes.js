"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtVerifier_1 = __importDefault(require("../middlewares/jwtVerifier"));
const authorController_1 = require("../controllers/authorController");
const authorRouter = express_1.default.Router();
authorRouter.get('/', jwtVerifier_1.default, authorController_1.getAuthor);
authorRouter.post('/', jwtVerifier_1.default, authorController_1.createAuthor);
authorRouter.put('/', jwtVerifier_1.default, authorController_1.updateAuthor);
authorRouter.put('/soft-delete', jwtVerifier_1.default, authorController_1.deleteAuthor);
authorRouter.get('/all', jwtVerifier_1.default, authorController_1.getALLAuthors);
authorRouter.get('/active', jwtVerifier_1.default, authorController_1.getActiveAuthors);
exports.default = authorRouter;
