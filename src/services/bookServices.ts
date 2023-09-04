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
  stock,
}: {
  isbn: number;
  name: string;
  bookCover?: string;
  bookCoverId?: string;
  authorId: number;
  categoryIds: number[];
  stock: number;
}) => {
  const newBook = await prisma.book.create({
    data: {
      isbn,
      name,
      bookCover,
      bookCoverId,
      isIssued: true,
      authorId,
      stock: {
        create: {
          quantity: stock,
        },
      },
      category: {
        connect: categoryIds.map((categoryId) => ({
          id: categoryId,
        })),
      },
    },
  });

  return newBook;
};

export const checkUniqueIsbn = async (isbn: number): Promise<boolean> => {
  const book = await prisma.book.findUnique({
    where: {
      isbn,
    },
  });

  return book ? false : true;
};
