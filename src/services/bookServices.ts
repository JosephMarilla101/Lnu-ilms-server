import { PrismaClient, BorrowedBookFee, RequestType } from '@prisma/client';
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
  isbn: string;
  name: string;
  bookCover?: string | null | undefined;
  bookCoverId?: string | null | undefined;
  authorId: number;
  categoryIds: number[];
  copies: number;
}) => {
  await checkUniqueIsbn(isbn);

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
  isbn,
  name,
  bookCover,
  bookCoverId,
  authorId,
  categoryIds,
  copies,
}: {
  id: number;
  isbn: string;
  name: string;
  bookCover?: string | null | undefined;
  bookCoverId?: string | null | undefined;
  authorId: number;
  categoryIds: number[];
  copies: number;
}) => {
  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (book.isbn !== isbn) {
    await checkUniqueIsbn(isbn);
  }

  // Get the IDs of the current book's categories
  const currentCategoryIds = book.category.map((category) => category.id);

  // Calculate the IDs to disconnect (categories not in the new list)
  const categoriesToDisconnect = currentCategoryIds.filter(
    (categoryId) => !categoryIds.includes(categoryId)
  );

  const updatedBook = await prisma.book.update({
    where: {
      id,
    },
    data: {
      isbn,
      name,
      bookCover,
      bookCoverId,
      authorId,
      copies,
      category: {
        disconnect: categoriesToDisconnect.map((categoryId) => ({
          id: categoryId,
        })),
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

export const getIssuedBooks = async ({
  isReturn,
  startDate,
  endDate,
}: {
  isReturn: boolean;
  startDate: string;
  endDate: string;
}) => {
  const books = await prisma.borrowedBook.findMany({
    where: {
      isReturn,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      book: {
        select: {
          isbn: true,
          name: true,
          bookCover: true,
        },
      },
      user: {
        select: {
          profile: {
            select: {
              id: true,
            },
          },
        },
      },
      dueDate: true,
      returnedDate: true,
      isReturn: true,
      lateFee: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const flattenResult = books.map((data) => {
    return {
      id: data.id,
      isbn: data.book.isbn.toString(), //convert to string in order to be searchable in data table
      bookName: data.book.name,
      borrowerId: data.user.profile?.id, //convert to string in order to be searchable in data table
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
      userId: true,
      book: {
        select: {
          name: true,
          isbn: true,
          bookCover: true,
          copies: true,
        },
      },
      user: {
        select: {
          profile: {
            select: {
              id: true,
            },
          },
        },
      },
      status: true,
      isCancelled: true,
      requestDate: true,
    },
    orderBy: {
      createdAt: 'desc',
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
      studentId: data.user.profile?.id.toString(), //convert to string in order to be searchable in data table
      borrowerId: data.userId,
      status: data.status,
      isCancelled: data.isCancelled,
      requestDate: data.requestDate,
    };
  });

  return flattenResult;
};

export const getBookList = async ({
  myCursor,
  filter,
  category,
}: {
  myCursor?: number;
  filter: string;
  category: string;
}) => {
  const booksId = await prisma.book.findMany({
    where: {
      name: {
        contains: filter,
      },
      AND: {
        category: {
          some: {
            name: {
              contains: category,
            },
          },
        },
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

export const getRequestedBook = async (userId: number) => {
  const requestedBook = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: {
        status: {
          in: ['PENDING', 'FORPICKUP', 'DISAPPROVED'],
        },
        AND: {
          isCancelled: false,
        },
      },
    },
    select: {
      id: true,
      book: {
        select: {
          id: true,
          isbn: true,
          name: true,
          bookCover: true,
          copies: true,
          author: true,
        },
      },
      status: true,
      isCancelled: true,
      requestDate: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return requestedBook;
};

export const getUnreturnedBook = async (userId: number) => {
  const requestedBook = await prisma.borrowedBook.findFirst({
    where: {
      userId,
      AND: {
        isReturn: false,
      },
    },
    select: {
      book: {
        select: {
          id: true,
          isbn: true,
          name: true,
          bookCover: true,
          copies: true,
          author: true,
        },
      },
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
  userId,
}: {
  bookId: number;
  userId: number;
}) => {
  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id: bookId,
    },
  });

  if (book.copies <= 0)
    throw new customeError(403, 'No copies of the selected book is available.');

  // if user request a new book update all DISAPPROVED book to isCancelled
  await prisma.borrowRequest.updateMany({
    where: {
      userId,
      AND: {
        status: 'DISAPPROVED',
      },
    },
    data: {
      isCancelled: true,
    },
  });

  const request = await prisma.borrowRequest.create({
    data: {
      bookId,
      userId,
    },
  });

  return request;
};

export const releaseBook = async ({
  id,
  bookId,
  userId,
}: {
  id: number;
  bookId: number;
  userId: number;
}) => {
  const borrowRequest = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: {
        bookId,
        AND: {
          id,
        },
      },
    },
  });

  if (!borrowRequest)
    throw new customeError(404, 'Book request cannot be found.');

  if (!borrowRequest.returnedDate)
    throw new customeError(404, 'Please specify book returned date.');

  const createdBorrowedBook = await createBorrowedBook({
    dueDate: borrowRequest.returnedDate,
    requestId: borrowRequest.id,
  });

  if (!createdBorrowedBook) throw new customeError(403, 'Error issuing book.');

  const request = await prisma.borrowRequest.update({
    where: {
      id: borrowRequest.id,
    },
    data: {
      status: 'RELEASED',
    },
  });

  return request;
};

export const changeRequestStatus = async ({
  id,
  bookId,
  userId,
  status,
  dueDate,
}: {
  id: number;
  bookId: number;
  userId: number;
  status: RequestType;
  dueDate?: Date | string | null;
}) => {
  const borrowRequest = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: {
        bookId,
        AND: {
          id,
        },
      },
    },
  });

  if (!borrowRequest)
    throw new customeError(404, 'Book request cannot be found.');

  // validation
  if (
    borrowRequest.status === 'RELEASED' ||
    borrowRequest.status === 'DISAPPROVED'
  )
    throw new customeError(
      403,
      'Cannot perform action on current request status.'
    );

  // validate change status to prevent jumping from pending to released
  if (borrowRequest.status === 'PENDING' && status === 'RELEASED')
    throw new customeError(
      403,
      'Cannot perform action on current request status.'
    );

  const request = await prisma.borrowRequest.update({
    where: {
      id: borrowRequest.id,
    },
    data: {
      status,
      returnedDate: dueDate,
    },
  });

  return request;
};

const createBorrowedBook = async ({
  dueDate,
  requestId,
}: {
  dueDate?: Date | string | null;
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

  const borrowedBook = await prisma.borrowedBook.create({
    data: {
      userId: request.userId,
      bookId: request.bookId,
      dueDate: dueDate ?? '',
    },
  });

  return borrowedBook;
};

export const disapproveRequest = async ({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) => {
  const borrowRequest = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: {
        bookId,
      },
    },
  });

  if (!borrowRequest)
    throw new customeError(404, 'Book request cannot be found.');

  const request = await prisma.borrowRequest.update({
    where: {
      id: borrowRequest.id,
    },
    data: {
      status: 'DISAPPROVED',
    },
  });

  return request;
};

export const markAsForPickupRequest = async ({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) => {
  const borrowRequest = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: {
        bookId,
      },
    },
  });

  if (!borrowRequest)
    throw new customeError(404, 'Book request cannot be found.');

  const request = await prisma.borrowRequest.update({
    where: {
      id: borrowRequest.id,
    },
    data: {
      status: 'FORPICKUP',
    },
  });

  return request;
};

export const cancelRequest = async ({ requestId }: { requestId: number }) => {
  const borrowRequest = await prisma.borrowRequest.findFirst({
    where: {
      id: requestId,
    },
  });

  if (!borrowRequest)
    throw new customeError(404, 'Book request cannot be found.');

  const request = await prisma.borrowRequest.update({
    where: {
      id: borrowRequest.id,
    },
    data: {
      isCancelled: true,
    },
  });

  return request;
};

export const canBorrow = async (userId: number): Promise<boolean> => {
  const hasBorrowed = await prisma.borrowedBook.findFirst({
    where: {
      userId,
      AND: {
        isReturn: false,
      },
    },
  });

  if (hasBorrowed) return false;
  else return true;
};

export const canRequest = async (userId: number): Promise<boolean> => {
  const request = await prisma.borrowRequest.findFirst({
    where: {
      userId,
      AND: [
        {
          status: {
            in: ['PENDING', 'FORPICKUP'],
          },
        },
        {
          NOT: {
            isCancelled: true,
          },
        },
      ],
    },
  });

  if (request) return false;
  else return true;
};

export const checkUniqueIsbn = async (isbn: string) => {
  const book = await prisma.book.findUnique({
    where: {
      isbn,
    },
  });

  if (book) throw new customeError(403, 'ISBN must be unique.');
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
