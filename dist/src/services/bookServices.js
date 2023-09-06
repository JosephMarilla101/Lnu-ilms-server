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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUniqueIsbn = exports.getBookList = exports.getBook = exports.createBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBook = ({ isbn, name, bookCover, bookCoverId, authorId, categoryIds, copies, }) => __awaiter(void 0, void 0, void 0, function* () {
    const newBook = yield prisma.book.create({
        data: {
            isbn,
            name,
            bookCover,
            bookCoverId,
            authorId,
            copies,
            category: {
                connect: categoryIds.map((categoryId) => ({
                    id: categoryId,
                })),
            },
        },
    });
    return newBook;
});
exports.createBook = createBook;
const getBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield prisma.book.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            id: true,
            isbn: true,
            name: true,
            bookCover: true,
            copies: true,
            author: {
                select: {
                    id: true,
                    name: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return book;
});
exports.getBook = getBook;
const getBookList = ({ myCursor, sortBy, }) => __awaiter(void 0, void 0, void 0, function* () {
    const booksId = yield prisma.book.findMany(Object.assign(Object.assign({ skip: myCursor ? 1 : 0, take: 20 }, (myCursor && {
        cursor: {
            id: myCursor,
        },
    })), { select: {
            id: true,
        }, orderBy: {
            createdAt: 'desc',
        } }));
    return booksId;
});
exports.getBookList = getBookList;
const checkUniqueIsbn = (isbn) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield prisma.book.findUnique({
        where: {
            isbn,
        },
    });
    return book ? false : true;
});
exports.checkUniqueIsbn = checkUniqueIsbn;
