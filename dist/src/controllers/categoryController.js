"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCategories = exports.getALLCategories = exports.getCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const zod_1 = __importDefault(require("zod"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const categoryServices = __importStar(require("../services/categoryServices"));
const customError_1 = __importDefault(require("../utils/customError"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status } = req.body;
        const Schema = zod_1.default.object({
            name: zod_1.default.string({ required_error: 'Author name is required.' }),
            status: zod_1.default.boolean({ required_error: 'Category status is required.' }),
        });
        const validated = Schema.parse({ name, status });
        const category = yield categoryServices.createCategory(validated);
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, status } = req.body;
        const Schema = zod_1.default.object({
            id: zod_1.default.number({ required_error: 'Category ID is required.' }),
            name: zod_1.default.string({ required_error: 'Category name is required.' }),
            status: zod_1.default.boolean({ required_error: 'Category status is required.' }),
        });
        const validated = Schema.parse({ id, name, status });
        const category = yield categoryServices.updateCategory(validated);
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const Schema = zod_1.default.object({
            id: zod_1.default.number({ required_error: 'Category ID is required.' }),
        });
        const validated = Schema.parse({ id });
        const category = yield categoryServices.deleteCategory(validated.id);
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.deleteCategory = deleteCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const Schema = zod_1.default.object({
            id: zod_1.default
                .string({
                required_error: 'Category ID is required.',
                invalid_type_error: 'Category ID is not a valid ID.',
            })
                .transform((value) => parseInt(value)),
        });
        const validated = Schema.parse({ id });
        if (!validated.id)
            throw new customError_1.default(403, 'Category ID is required.');
        const category = yield categoryServices.getCategory(validated.id);
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getCategory = getCategory;
const getALLCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryServices.getALLCategories();
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getALLCategories = getALLCategories;
const getActiveCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryServices.getActiveCategories();
        return res.status(200).json(category);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getActiveCategories = getActiveCategories;
