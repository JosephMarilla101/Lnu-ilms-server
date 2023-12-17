import { Response } from 'express';
import { parseISO, isPast, isToday } from 'date-fns';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import { RequestType } from '@prisma/client';
import z from 'zod';
import * as bookServices from '../services/bookServices';
import errHandler from '../middlewares/errorHandler';
import customeError from '../utils/customError';
import customError from '../utils/customError';

export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      isbn,
      name,
      bookCover,
      bookCoverId,
      authorId,
      categoryIds,
      copies,
    } = req.body;

    const Schema = z.object({
      isbn: z
        .string({ invalid_type_error: 'ISBN must be a unique.' })
        .min(1, 'ISBN is required.'),
      name: z
        .string({ required_error: 'Book title is required.' })
        .min(1, 'Book title is required.'),

      authorId: z.number({
        required_error: 'Book Author is required.',
      }),
      categoryIds: z
        .array(
          z.number({
            required_error: 'Book Category is required.',
          })
        )
        .refine((ids) => ids.length >= 1, {
          message: 'Please select at least 1 book category',
        }),
      copies: z.number(),
      bookCover: z
        .string({ invalid_type_error: 'Book Cover must be a string.' })
        .optional()
        .nullable(),
      bookCoverId: z
        .string({ invalid_type_error: 'Book Cover ID must be a string.' })
        .optional()
        .nullable(),
    });

    const validated = Schema.parse({
      name,
      bookCover,
      bookCoverId,
      authorId,
      categoryIds,
      copies,
      isbn,
    });

    const book = await bookServices.createBook(validated);

    return res.status(200).json(book);
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      id,
      isbn,
      name,
      bookCover,
      bookCoverId,
      authorId,
      categoryIds,
      copies,
    } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Book ID is required' }),
      isbn: z
        .string({ invalid_type_error: 'ISBN must be a unique.' })
        .min(1, 'ISBN is required.'),
      name: z
        .string({ required_error: 'Book name is required.' })
        .min(1, 'Book name is required.'),
      bookCover: z
        .string({ invalid_type_error: 'Book Cover must be a string.' })
        .optional()
        .nullable(),
      bookCoverId: z
        .string({ invalid_type_error: 'Book Cover ID must be a string.' })
        .optional()
        .nullable(),
      authorId: z.number({
        required_error: 'Book Author is required.',
      }),
      categoryIds: z
        .array(
          z.number({
            required_error: 'Book Category is required.',
          })
        )
        .refine((ids) => ids.length >= 1, {
          message: 'Please select at least 1 book category',
        }),
      copies: z.number(),
    });

    const validated = Schema.parse({
      isbn,
      name,
      bookCover,
      bookCoverId,
      authorId,
      categoryIds,
      copies,
      id,
    });

    const updatedBook = await bookServices.updateBook(validated);

    return res.status(200).json(updatedBook);
  } catch (error) {
    errHandler(error, res);
  }
};

export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Book ID is required' }),
    });

    const validated = Schema.parse({ id });

    const deletedBook = await bookServices.deleteBook(validated.id);

    return res.status(200).json(deletedBook);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.query.id;

    const Schema = z.object({
      id: z
        .string({
          required_error: 'Author ID is required.',
          invalid_type_error: 'Author ID is not a valid ID.',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ id });

    if (!validated.id) throw new customeError(403, 'Author ID is required.');

    const book = await bookServices.getBook(validated.id);

    return res.status(200).json(book);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getBookLateFee = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const lateFee = await bookServices.getBookLateFee();

    return res.status(200).json(lateFee);
  } catch (error) {
    errHandler(error, res);
  }
};

// export const createBorrowedBook = async (
//   req: AuthenticatedRequest,
//   res: Response
// ) => {
//   try {
//     const { dueDate, requestId } = req.body;

//     const Schema = z.object({
//       dueDate: z.string({
//         required_error: 'Book due date is required.',
//       }),
//       requestId: z.number({
//         required_error: 'Book request ID is required.',
//         invalid_type_error: 'Book request ID is not a valid ID.',
//       }),
//     });

//     const parsedDate = parseISO(dueDate);

//     if (isPast(parsedDate) || isToday(parsedDate)) {
//       throw new customError(403, "Cannot use past or today's date.");
//     }

//     const validated = Schema.parse({ dueDate, requestId });

//     const response = await bookServices.createBorrowedBook({
//       dueDate: parsedDate,
//       requestId: validated.requestId,
//     });

//     return res.status(200).json(response);
//   } catch (error) {
//     errHandler(error, res);
//   }
// };

export const deleteBorrowedBook = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { issuedId } = req.body;

    const Schema = z.object({
      issuedId: z.number({
        required_error: 'Issued book ID is required.',
        invalid_type_error: 'Issued book ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ issuedId });

    const issuedBook = await bookServices.deleteIssuedBook(validated.issuedId);

    return res.status(200).json(issuedBook);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getALLRequestedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const books = await bookServices.getALLRequestedBooks();

    return res.status(200).json(books);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getRequestedBook = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user?.id;

    const Schema = z.object({
      studentId: z.number({
        required_error: 'Student ID is required.',
        invalid_type_error: 'Student ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ studentId });

    const requestedBook = await bookServices.getRequestedBook(
      validated.studentId
    );

    return res.status(200).json(requestedBook);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getUnreturnedBook = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = req.user?.id;

    const Schema = z.object({
      studentId: z.number({
        required_error: 'Student ID is required.',
        invalid_type_error: 'Student ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ studentId });

    const borrowedBook = await bookServices.getUnreturnedBook(
      validated.studentId
    );

    return res.status(200).json(borrowedBook);
  } catch (error) {
    errHandler(error, res);
  }
};

export const returnBorrowedBook = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { borrowedBookId } = req.body;

    const Schema = z.object({
      borrowedBookId: z.number({
        required_error: 'Borrowed Book ID is required.',
        invalid_type_error: 'Borrowed Book ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ borrowedBookId });

    const book = await bookServices.returnBorrowedBook(validated);

    return res.status(200).json(book);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getAllIssuedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const issuedBooks = await bookServices.getAllIssuedBooks();

    return res.status(200).json(issuedBooks);
  } catch (error) {
    errHandler(error, res);
  }
};

export const requestBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookId } = req.body;
    const userId = req.user?.id;

    const Schema = z.object({
      bookId: z.number({
        required_error: 'Book ID is required.',
        invalid_type_error: 'Book ID is not a valid ID.',
      }),
      userId: z.number({
        required_error: 'User ID is required.',
        invalid_type_error: 'User ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ bookId, userId });

    const canBorrow = await bookServices.canBorrow(validated.userId);

    const canRequest = await bookServices.canRequest(validated.userId);

    if (!canBorrow)
      return res
        .status(403)
        .json({ message: 'Cannot request book if you have an unreturn book.' });

    if (!canRequest)
      return res.status(403).json({
        message: 'Only one book can be requested or borrowed at a time.',
      });

    const request = await bookServices.requestBook(validated);

    return res.status(200).json(request);
  } catch (error) {
    errHandler(error, res);
  }
};

export const releaseBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, bookId, userId } = req.body;

    const Schema = z.object({
      id: z.number({
        required_error: 'Request ID is required.',
        invalid_type_error: 'Request ID is not a valid ID.',
      }),
      bookId: z.number({
        required_error: 'Book ID is required.',
        invalid_type_error: 'Book ID is not a valid ID.',
      }),
      userId: z.number({
        required_error: 'User ID is required.',
        invalid_type_error: 'User ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ id, bookId, userId });

    const request = await bookServices.releaseBook(validated);

    return res.status(200).json(request);
  } catch (error) {
    errHandler(error, res);
  }
};

export const changeRequestStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id, bookId, userId, status, dueDate } = req.body;

    const Schema = z.object({
      id: z.number({
        required_error: 'Book ID is required.',
        invalid_type_error: 'Book ID is not a valid ID.',
      }),
      bookId: z.number({
        required_error: 'Book ID is required.',
        invalid_type_error: 'Book ID is not a valid ID.',
      }),
      userId: z.number({
        required_error: 'User ID is required.',
        invalid_type_error: 'User ID is not a valid ID.',
      }),
      status: z.nativeEnum(RequestType, {
        required_error: 'Status is required.',
        invalid_type_error: 'Invalid request status.',
      }),
      dueDate: z
        .string({
          required_error: 'Book due date is required.',
        })
        .optional()
        .nullable(),
    });

    const validated = Schema.parse({ id, bookId, userId, status, dueDate });

    const request = await bookServices.changeRequestStatus(validated);

    return res.status(200).json(request);
  } catch (error) {
    errHandler(error, res);
  }
};

export const disapproveRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { bookId, userId } = req.body;

    const Schema = z.object({
      bookId: z.number({
        required_error: 'Book ID is required.',
        invalid_type_error: 'Book ID is not a valid ID.',
      }),
      userId: z.number({
        required_error: 'User ID is required.',
        invalid_type_error: 'User ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ bookId, userId });

    const request = await bookServices.disapproveRequest(validated);

    return res.status(200).json(request);
  } catch (error) {
    errHandler(error, res);
  }
};

export const cancelRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.body;

    const Schema = z.object({
      requestId: z.number({
        required_error: 'Request ID is required.',
        invalid_type_error: 'Request ID is not a valid ID.',
      }),
    });

    const validated = Schema.parse({ requestId });

    const request = await bookServices.cancelRequest(validated);

    return res.status(200).json(request);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getBookList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const myCursor = req.query.cursor;
    const filter = req.query.filter;
    const category = req.query.category;

    const Schema = z.object({
      myCursor: z.string().transform((value) => parseInt(value)),
      filter: z.string(),
      category: z.string(),
    });

    const validated = Schema.parse({ myCursor, filter, category });

    const bookList = await bookServices.getBookList(validated);

    return res.status(200).json(bookList);
  } catch (error) {
    errHandler(error, res);
  }
};

// const generateUniqueISBN = async (): Promise<number> => {
//   while (true) {
//     const isbn = generateRandom9DigitNumber();

//     const isUnique = await bookServices.checkUniqueIsbn(isbn);

//     if (isUnique) {
//       return isbn;
//     }
//   }
// };

function generateRandom9DigitNumber() {
  let randomNumber = '';
  for (let i = 0; i < 9; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return parseInt(randomNumber);
}
