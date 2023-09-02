"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const customError_1 = __importDefault(require("../utils/customError"));
const errHandler = (error, res) => {
    if (error instanceof customError_1.default)
        return res.status(error.statusCode).json({ message: error.message });
    else if (error instanceof zod_1.ZodError)
        return res.status(403).json({ message: error.issues[0].message });
    else if (error instanceof Error)
        return res.status(400).json({ message: error.message });
    else
        return res.status(500).json({ message: 'An unexpected error has occured' });
};
exports.default = errHandler;
