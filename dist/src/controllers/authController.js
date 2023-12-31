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
exports.authenticateUser = exports.studentLogin = exports.adminLogin = void 0;
const zod_1 = __importDefault(require("zod"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authServices = __importStar(require("../services/authServices"));
const tokenGenerator_1 = __importDefault(require("../utils/tokenGenerator"));
const customError_1 = __importDefault(require("../utils/customError"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const Schema = zod_1.default.object({
            username: zod_1.default
                .string({ required_error: 'Username is required.' })
                .min(1, 'Username is required'),
            password: zod_1.default.string({ required_error: 'Password is required.' }),
        });
        const validated = Schema.parse({ username, password });
        const user = yield authServices.adminLogin(validated);
        const token = (0, tokenGenerator_1.default)(user);
        return res.status(200).json({ user, token });
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.adminLogin = adminLogin;
const studentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const Schema = zod_1.default.object({
            email: zod_1.default
                .string({ required_error: 'Email is required.' })
                .min(1, 'Email is required.'),
            password: zod_1.default.string({ required_error: 'Password is required.' }),
        });
        const validated = Schema.parse({ email, password });
        const user = yield authServices.studentLogin(validated);
        const token = (0, tokenGenerator_1.default)(user);
        return res.status(200).json({ user, token });
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.studentLogin = studentLogin;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) === 'ADMIN') {
            const auth = yield authServices.findAdmin(user.id);
            return res.status(200).json(auth);
        }
        if ((user === null || user === void 0 ? void 0 : user.role) === 'LIBRARIAN') {
            const auth = yield authServices.findLibrarian(user.id);
            return res.status(200).json(auth);
        }
        if ((user === null || user === void 0 ? void 0 : user.role) === 'STUDENT') {
            const auth = yield authServices.findStudent(user.id);
            return res.status(200).json(auth);
        }
        throw new customError_1.default(404, 'Unauthorize.');
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.authenticateUser = authenticateUser;
