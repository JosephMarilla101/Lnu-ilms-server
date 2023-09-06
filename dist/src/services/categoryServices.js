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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCategories = exports.getALLCategories = exports.getCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const customError_1 = __importDefault(require("../utils/customError"));
const prisma = new client_1.PrismaClient();
// When fetchin category, exclude the softdeleted category by adding isDeleted = false in where clause
const createCategory = ({ name, status, }) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.category.create({
        data: {
            name,
            status,
        },
    });
    return category;
});
exports.createCategory = createCategory;
const updateCategory = ({ id, name, status, }) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updatedCategory = yield prisma.category.update({
        where: {
            id,
        },
        data: {
            name,
            status,
        },
    });
    return updatedCategory;
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.category.findUnique({
        where: {
            id,
        },
    });
    if (!category)
        throw new customError_1.default(404, 'Category not found.');
    const date = new Date();
    const deletedCategory = yield prisma.category.update({
        where: {
            id: category.id,
        },
        data: {
            isDeleted: true,
            deletedAt: date,
        },
    });
    return deletedCategory;
});
exports.deleteCategory = deleteCategory;
const getCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.category.findUnique({
        where: {
            id,
        },
    });
    if (!category)
        throw new customError_1.default(404, 'Category not found.');
    return category;
});
exports.getCategory = getCategory;
const getALLCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma.category.findMany({
        where: {
            isDeleted: false,
        },
    });
    return categories;
});
exports.getALLCategories = getALLCategories;
const getActiveCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma.category.findMany({
        where: {
            isDeleted: false,
            AND: {
                status: true,
            },
        },
    });
    return categories;
});
exports.getActiveCategories = getActiveCategories;
