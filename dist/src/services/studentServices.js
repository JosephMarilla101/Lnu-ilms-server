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
exports.studentLogin = exports.studentRegistration = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const customError_1 = __importDefault(require("../utils/customError"));
const prisma = new client_1.PrismaClient();
const studentRegistration = ({ studentId, fullname, course, college, mobile, email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield isUniqueStudentId(studentId);
    const hashPassword = bcrypt_1.default.hashSync(password, 10);
    const student = yield prisma.student.create({
        data: {
            studentId,
            email,
            fullname,
            course,
            college,
            mobile,
            password: hashPassword,
        },
    });
    return student;
});
exports.studentRegistration = studentRegistration;
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
const isUniqueStudentId = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma.student.findUnique({
        where: {
            studentId,
        },
    });
    if (student)
        throw new customError_1.default(403, 'Student ID is not valid.');
});
