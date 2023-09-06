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
exports.findStudent = exports.findLibrarian = exports.findAdmin = exports.studentLogin = exports.librarianLogin = exports.adminLogin = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const customError_1 = __importDefault(require("../utils/customError"));
const prisma = new client_1.PrismaClient();
const adminLogin = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.admin.findUnique({
        where: {
            username,
        },
    });
    if (!admin)
        throw new customError_1.default(401, 'Invalid username or password.');
    const passwordMatch = bcrypt_1.default.compareSync(password, admin.password);
    if (!passwordMatch)
        throw new customError_1.default(401, 'Invalid username or password.');
    return admin;
});
exports.adminLogin = adminLogin;
const librarianLogin = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const librarian = yield prisma.librarian.findUnique({
        where: {
            email,
        },
    });
    if (!librarian)
        throw new customError_1.default(401, 'Invalid email or password.');
    const passwordMatch = bcrypt_1.default.compareSync(password, librarian.password);
    if (!passwordMatch)
        throw new customError_1.default(401, 'Invalid email or password.');
    return librarian;
});
exports.librarianLogin = librarianLogin;
const studentLogin = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma.student.findUnique({
        where: {
            email,
        },
    });
    if (!student)
        throw new customError_1.default(401, 'Invalid email or password.');
    const passwordMatch = bcrypt_1.default.compareSync(password, student.password);
    if (!passwordMatch)
        throw new customError_1.default(401, 'Invalid email or password.');
    return student;
});
exports.studentLogin = studentLogin;
const findAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return admin;
});
exports.findAdmin = findAdmin;
const findLibrarian = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const librarian = yield prisma.librarian.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return librarian;
});
exports.findLibrarian = findLibrarian;
const findStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma.student.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return student;
});
exports.findStudent = findStudent;
