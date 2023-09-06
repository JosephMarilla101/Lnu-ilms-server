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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield adminSeeder();
        yield authorSeeder();
        yield categorySeeder();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
function adminSeeder() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmail = 'admin@gmail.com';
        const adminUsername = 'admin';
        const adminPassword = 'admin123';
        const hashPassword = bcrypt_1.default.hashSync(adminPassword, 10);
        yield prisma.admin.upsert({
            where: { email: adminEmail },
            update: {
                email: adminEmail,
                username: adminUsername,
                password: hashPassword,
            },
            create: {
                email: adminEmail,
                username: adminUsername,
                password: hashPassword,
            },
        });
        console.log('Admin table seeded successfully');
    });
}
function authorSeeder() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.author.upsert({
            where: {
                id: 1,
            },
            update: {
                name: 'J.K Rowling',
            },
            create: {
                name: 'J.K Rowling',
            },
        });
        yield prisma.author.upsert({
            where: {
                id: 2,
            },
            update: {
                name: 'R.R Martin',
            },
            create: {
                name: 'R.R Martin',
            },
        });
        console.log('Author table seeded successfully');
    });
}
function categorySeeder() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.category.upsert({
            where: {
                id: 1,
            },
            update: {
                name: 'Fantasy',
                status: true,
            },
            create: {
                name: 'Fantasy',
                status: true,
            },
        });
        yield prisma.category.upsert({
            where: {
                id: 2,
            },
            update: {
                name: 'Action',
                status: true,
            },
            create: {
                name: 'Action',
                status: true,
            },
        });
        console.log('Category table seeded successfully');
    });
}
