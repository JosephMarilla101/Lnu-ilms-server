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
exports.getActiveAuthors = exports.getALLAuthors = exports.getAuthor = exports.deleteAuthor = exports.updateAuthor = exports.createAuthor = void 0;
const client_1 = require("@prisma/client");
const customError_1 = __importDefault(require("../utils/customError"));
const prisma = new client_1.PrismaClient();
// When fetchin author, exclude the softdeleted author by adding isDeleted = false in where clause
const createAuthor = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield prisma.author.create({
        data: {
            name,
        },
    });
    return author;
});
exports.createAuthor = createAuthor;
const updateAuthor = ({ id, name, status, }) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield prisma.author.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updatedAuthor = yield prisma.author.update({
        where: {
            id,
        },
        data: {
            name,
            status,
        },
    });
    return updatedAuthor;
});
exports.updateAuthor = updateAuthor;
const deleteAuthor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield prisma.author.findUnique({
        where: {
            id,
        },
    });
    if (!author)
        throw new customError_1.default(404, 'Author not found.');
    const date = new Date();
    const deletedAuthor = yield prisma.author.update({
        where: {
            id: author.id,
        },
        data: {
            isDeleted: true,
            deletedAt: date,
        },
    });
    return deletedAuthor;
});
exports.deleteAuthor = deleteAuthor;
const getAuthor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield prisma.author.findUnique({
        where: {
            id,
        },
    });
    if (!author)
        throw new customError_1.default(404, 'Author not found.');
    return author;
});
exports.getAuthor = getAuthor;
const getALLAuthors = () => __awaiter(void 0, void 0, void 0, function* () {
    const authors = yield prisma.author.findMany({
        where: {
            isDeleted: false,
        },
    });
    return authors;
});
exports.getALLAuthors = getALLAuthors;
const getActiveAuthors = () => __awaiter(void 0, void 0, void 0, function* () {
    const authors = yield prisma.author.findMany({
        where: {
            isDeleted: false,
            AND: {
                status: true,
            },
        },
    });
    return authors;
});
exports.getActiveAuthors = getActiveAuthors;
