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
exports.getBookList = exports.getBook = exports.createBook = void 0;
const zod_1 = __importDefault(require("zod"));
const bookServices = __importStar(require("../services/bookServices"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, bookCover, bookCoverId, authorId, categoryIds, copies } = req.body;
        const isbn = yield generateUniqueISBN();
        const Schema = zod_1.default.object({
            name: zod_1.default
                .string({ required_error: 'Book name is required.' })
                .min(1, 'Book name is required.'),
            bookCover: zod_1.default
                .string({ invalid_type_error: 'Book Cover must be a string.' })
                .optional(),
            bookCoverId: zod_1.default
                .string({ invalid_type_error: 'Book Cover ID must be a string.' })
                .optional(),
            authorId: zod_1.default.number({
                required_error: 'Book Author is required.',
            }),
            categoryIds: zod_1.default
                .array(zod_1.default.number({
                required_error: 'Book Category is required.',
            }))
                .refine((ids) => ids.length >= 1, {
                message: 'Please select at least 1 book category',
            }),
            copies: zod_1.default.number(),
            isbn: zod_1.default.number({ invalid_type_error: 'ISBN must be a unique number.' }),
        });
        const validated = Schema.parse({
            name,
            bookCover,
            bookCoverId,
            authorId,
            categoryIds,
            copies,
            isbn,
        });
        const book = yield bookServices.createBook(validated);
        return res.status(200).json(book);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.createBook = createBook;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const Schema = zod_1.default.object({
            id: zod_1.default
                .string({
                required_error: 'Author ID is required.',
                invalid_type_error: 'Author ID is not a valid ID.',
            })
                .transform((value) => parseInt(value)),
        });
        const validated = Schema.parse({ id });
        if (!validated.id)
            throw new customError_1.default(403, 'Author ID is required.');
        const book = yield bookServices.getBook(validated.id);
        return res.status(200).json(book);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getBook = getBook;
const getBookList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myCursor = req.params.cursor;
        const Schema = zod_1.default.object({
            myCursor: zod_1.default
                .string()
                .transform((value) => parseInt(value))
                .optional(),
        });
        const validated = Schema.parse({ myCursor });
        const bookList = yield bookServices.getBookList(validated);
        return res.status(200).json(bookList);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getBookList = getBookList;
const generateUniqueISBN = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        const isbn = generateRandom9DigitNumber();
        const isUnique = yield bookServices.checkUniqueIsbn(isbn);
        if (isUnique) {
            return isbn;
        }
    }
});
function generateRandom9DigitNumber() {
    let randomNumber = '';
    for (let i = 0; i < 9; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return parseInt(randomNumber);
}
