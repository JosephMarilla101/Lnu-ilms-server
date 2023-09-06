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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = __importDefault(require("./src/config/cors"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const studentRoutes_1 = __importDefault(require("./src/routes/studentRoutes"));
const authorRoutes_1 = __importDefault(require("./src/routes/authorRoutes"));
const categoryRoutes_1 = __importDefault(require("./src/routes/categoryRoutes"));
const bookRoutes_1 = __importDefault(require("./src/routes/bookRoutes"));
const client_1 = require("@prisma/client");
const PORT = parseInt(process.env.PORT) || 5000;
/*
To run server on local network, get the ipv4 address
of your machine and change the LOCAL_IP env value
*/
const NETWORK_ADDRESS = `${process.env.LOCAL_IP}:${PORT}`;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)(cors_2.default));
app.use(express_1.default.json());
if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    app.listen(PORT, '0.0.0.0', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log(`Server running on port ${PORT}`);
            console.log(`Server running on ${NETWORK_ADDRESS}`);
        }
        catch (error) {
            console.log(error);
            yield prisma.$disconnect();
            process.exit(1);
        }
    }));
}
else {
    app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log(`Server running on port ${PORT}`);
        }
        catch (error) {
            console.log(error);
            yield prisma.$disconnect();
            process.exit(1);
        }
    }));
}
console.log('test');
// api routes
app.all('/api', (req, res) => {
    res.status(200).send('Welcome to LNU-ILMS api');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/student', studentRoutes_1.default);
app.use('/api/author', authorRoutes_1.default);
app.use('/api/category', categoryRoutes_1.default);
app.use('/api/book', bookRoutes_1.default);
app.all('*', (req, res) => {
    res.status(404).send('ROUTE NOT FOUND');
});
