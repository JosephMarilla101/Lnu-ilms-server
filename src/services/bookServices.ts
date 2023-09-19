import { PrismaClient, BorrowedBookFee } from '@prisma/client';
import { differenceInDays, isAfter } from 'date-fns';
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

export const updateBook = async ({
  id,
  name,
  bookCover,
  bookCoverId,
  authorId,
  categoryIds,
  copies,
}: {
  id: number;
  name: string;
  bookCover?: string;
  bookCoverId?: string;
  authorId: number;
  categoryIds: number[];
  copies: number;
}) => {
  await prisma.book.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const updatedBook = await prisma.book.update({
    where: {
      id,
    },
    data: {
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

  return updatedBook;
};

export const deleteBook = async (id: number) => {
  await prisma.book.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deletedBook = await prisma.book.delete({
    where: {
      id,
    },
  });

  return deletedBook;
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

export const getBookLateFee = async (): Promise<BorrowedBookFee> => {
  const lateFee = await prisma.borrowedBookFee.findFirstOrThrow();

  return lateFee;
};

export const deleteIssuedBook = async (issuedId: number) => {
  const issuedBook = await prisma.borrowedBook.delete({
    where: {
      id: issuedId,
    },
  });

  return issuedBook;
};

export const createBorrowedBook = async ({
  dueDate,
  requestId,
}: {
  dueDate: Date;
  requestId: number;
}) => {
  const request = await prisma.borrowRequest.findFirstOrThrow({
    where: {
      id: requestId,
    },
  });

  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id: request.bookId,
    },
  });

  if (book?.copies <= 0)
    throw new customeError(403, 'No copies of the selected book is available.');

  await prisma.book.update({
    where: {
      id: book.id,
    },
    data: {
      copies: {
        decrement: 1,
      },
    },
  });

  await prisma.borrowRequest.update({
    where: {
      id: request.id,
    },
    data: {
      isApproved: true,
    },
  });

  const borrowedBook = await prisma.borrowedBook.create({
    data: {
      studentId: request.studentId,
      bookId: request.bookId,
      dueDate,
    },
  });

  return borrowedBook;
};

export const getAllIssuedBooks = async () => {
  const books = await prisma.borrowedBook.findMany({
    select: {
      id: true,
      book: {
        select: {
          isbn: true,
          name: true,
          bookCover: true,
        },
      },
      student: {
        select: {
          studentId: true,
        },
      },
      dueDate: true,
      returnedDate: true,
      isReturn: true,
      lateFee: true,
    },
    orderBy: {
      isReturn: 'asc',
    },
  });

  const flattenResult = books.map((data) => {
    return {
      id: data.id,
      isbn: data.book.isbn.toString(), //convert to string in order to be searchable in data table
      bookName: data.book.name,
      studentId: data.student.studentId.toString(), //convert to string in order to be searchable in data table
      dueDate: data.dueDate,
      returnedDate: data.returnedDate,
      isReturn: data.isReturn,
      lateFee: data.lateFee,
      bookCover: data.book.bookCover,
    };
  });

  return flattenResult;
};

export const getALLRequestedBooks = async () => {
  const requestBooks = await prisma.borrowRequest.findMany({
    select: {
      id: true,
      bookId: true,
      studentId: true,
      book: {
        select: {
          name: true,
          isbn: true,
          bookCover: true,
          copies: true,
        },
      },
      student: {
        select: {
          studentId: true,
        },
      },
      isApproved: true,
      requestDate: true,
    },
    orderBy: {
      isApproved: 'asc',
    },
  });

  const flattenResult = requestBooks.map((data) => {
    return {
      id: data.id,
      bookId: data.bookId,
      bookName: data.book.name,
      bookCover: data.book.bookCover,
      copies: data.book.copies,
      isbn: data.book.isbn.toString(), //convert to string in order to be searchable in data table
      studentId: data.student.studentId.toString(), //convert to string in order to be searchable in data table
      borrowerId: data.studentId,
      isApproved: data.isApproved,
      requestDate: data.requestDate,
    };
  });

  return flattenResult;
};

export const getBookList = async ({
  myCursor,
  filter,
}: {
  myCursor?: number;
  filter: string;
}) => {
  const booksId = await prisma.book.findMany({
    where: {
      name: {
        contains: filter,
      },
    },
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
      createdAt: 'asc',
    },
  });

  return booksId;
};

export const getRequestedBook = async (studentId: number) => {
  const requestedBook = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
      AND: {
        isApproved: false,
      },
    },
    select: {
      book: true,
      isApproved: true,
      requestDate: true,
      updatedAt: true,
    },
  });

  return requestedBook;
};

export const getUnreturnedBook = async (studentId: number) => {
  const requestedBook = await prisma.borrowedBook.findFirst({
    where: {
      studentId,
      AND: {
        isReturn: false,
      },
    },
    select: {
      book: true,
      isReturn: true,
      dueDate: true,
    },
  });

  return requestedBook;
};

export const returnBorrowedBook = async ({
  borrowedBookId,
}: {
  borrowedBookId: number;
}) => {
  const borrowedBook = await prisma.borrowedBook.findFirstOrThrow({
    where: {
      id: borrowedBookId,
      AND: {
        isReturn: false,
      },
    },
  });

  const lateFee = await prisma.borrowedBookFee.findFirstOrThrow();

  const fee = calculateLateFee(
    borrowedBook.dueDate,
    lateFee.initialFee,
    lateFee.followingDateFee
  );

  // update book copies, borrowed book status, lateFee and return date
  const updatedBorrowedBook = await prisma.borrowedBook.update({
    where: {
      id: borrowedBookId,
    },
    data: {
      isReturn: true,
      returnedDate: new Date(),
      lateFee: fee,
      book: {
        update: {
          copies: {
            increment: 1,
          },
        },
      },
    },
  });

  return updatedBorrowedBook;
};

export const requestBook = async ({
  bookId,
  studentId,
}: {
  bookId: number;
  studentId: number;
}) => {
  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id: bookId,
    },
  });

  if (book.copies <= 0)
    throw new customeError(403, 'No copies of the selected book is available.');

  const request = await prisma.borrowRequest.create({
    data: {
      bookId,
      studentId,
    },
  });

  return request;
};

export const cancelRequest = async ({
  bookId,
  studentId,
}: {
  bookId: number;
  studentId: number;
}) => {
  const request = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
      AND: {
        bookId,
      },
    },
  });

  if (!request) throw new customeError(404, 'Book request cannot be found.');

  await prisma.borrowRequest.delete({
    where: {
      id: request.id,
    },
  });

  return request;
};

export const canBorrow = async (studentId: number): Promise<boolean> => {
  const hasBorrowed = await prisma.borrowedBook.findFirst({
    where: {
      studentId,
      AND: {
        isReturn: false,
      },
    },
  });

  if (hasBorrowed) return false;
  else return true;
};

export const canRequest = async (studentId: number): Promise<boolean> => {
  const hasRequested = await prisma.borrowRequest.findFirst({
    where: {
      studentId,
      AND: {
        isApproved: false,
      },
    },
  });

  if (hasRequested) return false;
  else return true;
};

export const checkUniqueIsbn = async (isbn: number): Promise<boolean> => {
  const book = await prisma.book.findUnique({
    where: {
      isbn,
    },
  });

  return book ? false : true;
};

const calculateLateFee = (
  dueDate: Date,
  initialFee: number,
  followingDateFee: number
): number => {
  const currentDateAndTime = new Date();

  const daysLate = differenceInDays(currentDateAndTime, dueDate);

  let lateFee = 0;

  if (isAfter(currentDateAndTime, dueDate)) lateFee = lateFee + initialFee;

  // add the followingDateFee if late for more than 1 day
  if (daysLate >= 1) {
    for (let i = daysLate; i >= 1; i--) {
      lateFee = lateFee + followingDateFee;
    }
  }

  return lateFee;
};
