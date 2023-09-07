import { PrismaClient, Book } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const createBook = async ({
  isbn,
  name,
  bookCover,
  bookCoverId,
  authorId,
  categoryIds,
  copies,
}: {
  isbn: number;
  name: string;
  bookCover?: string;
  bookCoverId?: string;
  authorId: number;
  categoryIds: number[];
  copies: number;
}) => {
  const newBook = await prisma.book.create({
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
};

export const getBook = async (id: number) => {
  const book = await prisma.book.findUniqueOrThrow({
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
};

export const getBookList = async ({
  myCursor,
  sortBy,
}: {
  myCursor?: number;
  sortBy?: string;
}) => {
  const booksId = await prisma.book.findMany({
    skip: myCursor ? 1 : 0,
    take: 10,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return booksId;
};

export const requestBook = async ({
  bookId,
  studentId,
}: {
  bookId: number;
  studentId: number;
}) => {
  const hasRequested = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
    },
  });

  if (hasRequested)
    throw new customeError(401, 'Cannot request multiple books at a time');

  const request = await prisma.borrowRequest.create({
    data: {
      bookId,
      studentId,
    },
  });

  return request;
};

export const checkUniqueIsbn = async (isbn: number): Promise<boolean> => {
  const book = await prisma.book.findUnique({
    where: {
      isbn,
    },
  });

  return book ? false : true;
};
