"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtVerifier_1 = __importDefault(require("../middlewares/jwtVerifier"));
const bookController_1 = require("../controllers/bookController");
const bookRouter = express_1.default.Router();
bookRouter.get('/', jwtVerifier_1.default, bookController_1.getBook);
bookRouter.get('/list', jwtVerifier_1.default, bookController_1.getBookList);
bookRouter.post('/', jwtVerifier_1.default, bookController_1.createBook);
exports.default = bookRouter;
