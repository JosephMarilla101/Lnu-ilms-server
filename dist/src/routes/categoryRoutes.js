"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtVerifier_1 = __importDefault(require("../middlewares/jwtVerifier"));
const categoryController_1 = require("../controllers/categoryController");
const categoryRouter = express_1.default.Router();
categoryRouter.get('/', jwtVerifier_1.default, categoryController_1.getCategory);
categoryRouter.post('/', jwtVerifier_1.default, categoryController_1.createCategory);
categoryRouter.put('/', jwtVerifier_1.default, categoryController_1.updateCategory);
categoryRouter.put('/soft-delete', jwtVerifier_1.default, categoryController_1.deleteCategory);
categoryRouter.get('/all', jwtVerifier_1.default, categoryController_1.getALLCategories);
categoryRouter.get('/active', jwtVerifier_1.default, categoryController_1.getActiveCategories);
exports.default = categoryRouter;
