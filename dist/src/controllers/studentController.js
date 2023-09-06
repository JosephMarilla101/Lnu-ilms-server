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
exports.studentRegistration = void 0;
const zod_1 = __importDefault(require("zod"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const studentServices = __importStar(require("../services/studentServices"));
const customError_1 = __importDefault(require("../utils/customError"));
const studentRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, email, fullname, course, college, mobile, password, password_confirmation, } = req.body;
        const Schema = zod_1.default
            .object({
            studentId: zod_1.default
                .string({ required_error: 'Student ID is required.' })
                .min(4, {
                message: 'Student ID must be at least 4 characters.',
            })
                .max(8, { message: 'Student ID must not exceed 8 characters.' })
                .transform((value) => parseInt(value)),
            email: zod_1.default.string({ required_error: 'Email is required' }).email(),
            fullname: zod_1.default.string({ required_error: 'Full Name is required.' }),
            course: zod_1.default.string({ required_error: 'Course is required.' }),
            college: zod_1.default.string({ required_error: 'College is required.' }),
            mobile: zod_1.default.string({ required_error: 'Mobile number is required.' }),
            password: zod_1.default
                .string({ required_error: 'Password is required.' })
                .min(6, 'Password must contain at least 6 character(s).')
                .transform((value) => value.trim()),
            password_confirmation: zod_1.default
                .string({
                required_error: 'Password confimation is required.',
            })
                .transform((value) => value.trim()),
        })
            .refine((data) => data.password === data.password_confirmation, {
            message: 'Passwords do not match.',
            path: ['password_confirmation'],
        });
        const validated = Schema.parse({
            studentId,
            email,
            fullname,
            course,
            college,
            mobile,
            password,
            password_confirmation,
        });
        if (!validated.studentId)
            throw new customError_1.default(403, 'Student ID is not a valid ID.');
        const student = yield studentServices.studentRegistration(validated);
        return res.status(200).json(student);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.studentRegistration = studentRegistration;
