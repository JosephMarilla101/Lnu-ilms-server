import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const totalBooks = async (): Promise<number> => {
  const total = await prisma.book.count();

  return total;
};

export const totalUnreturnedBooks = async (): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      isReturn: false,
    },
  });

  return total;
};

export const myTotalUnreturnedBooks = async (
  userId: number
): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      isReturn: false,
      AND: {
        userId,
      },
    },
  });

  return total;
};

export const totalRequestedBooks = async (): Promise<number> => {
  const total = await prisma.borrowRequest.count({
    where: {
      isApproved: false,
    },
  });

  return total;
};

export const myTotalRequestedBooks = async (
  userId: number
): Promise<number> => {
  const total = await prisma.borrowRequest.count({
    where: {
      isApproved: false,
      AND: {
        userId,
      },
    },
  });

  return total;
};

export const totalBorrowedBooks = async (): Promise<number> => {
  const total = await prisma.borrowedBook.count();

  return total;
};

export const myTotalBorrowedBooks = async (userId: number): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      userId,
    },
  });

  return total;
};

export const totalAuthors = async (): Promise<number> => {
  const total = await prisma.author.count({
    where: {
      isDeleted: false,
    },
  });

  return total;
};

export const totalCatoegories = async (): Promise<number> => {
  const total = await prisma.category.count({
    where: {
      isDeleted: false,
    },
  });

  return total;
};

export const totalStudents = async (): Promise<number> => {
  const total = await prisma.user.count({
    where: {
      role: 'STUDENT',
    },
  });

  return total;
};

export const totalLibrarians = async (): Promise<number> => {
  const total = await prisma.librarian.count();

  return total;
};
