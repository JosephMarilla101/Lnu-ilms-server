import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import * as bookServices from '../services/bookServices';
import errHandler from '../middlewares/errorHandler';
import customeError from '../utils/customError';

export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, bookCover, bookCoverId, authorId, categoryIds, stock } =
      req.body;

    const isbn = await generateUniqueISBN();

    const Schema = z.object({
      name: z
        .string({ required_error: 'Book name is required.' })
        .min(1, 'Book name is required.'),
      bookCover: z
        .string({ invalid_type_error: 'Book Cover must be a string.' })
        .optional(),
      bookCoverId: z
        .string({ invalid_type_error: 'Book Cover ID must be a string.' })
        .optional(),
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
      stock: z.number(),
      isbn: z.number({ invalid_type_error: 'ISBN must be a unique number.' }),
    });

    const validated = Schema.parse({
      name,
      bookCover,
      bookCoverId,
      authorId,
      categoryIds,
      stock,
      isbn,
    });

    console.log(validated);

    const book = await bookServices.createBook(validated);

    return res.status(200).json(book);
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
          required_error: 'Author ID is required',
          invalid_type_error: 'Author ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ id });

    if (!validated.id) throw new customeError(403, 'Author ID is required');

    const book = await bookServices.getBook(validated.id);

    return res.status(200).json(book);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getBookList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const myCursor = req.params.cursor;

    const Schema = z.object({
      myCursor: z
        .string()
        .transform((value) => parseInt(value))
        .optional(),
    });

    const validated = Schema.parse({ myCursor });

    const bookList = await bookServices.getBookList(validated);

    return res.status(200).json(bookList);
  } catch (error) {
    errHandler(error, res);
  }
};

const generateUniqueISBN = async (): Promise<number> => {
  while (true) {
    const isbn = generateRandom9DigitNumber();

    const isUnique = await bookServices.checkUniqueIsbn(isbn);

    if (isUnique) {
      return isbn;
    }
  }
};

function generateRandom9DigitNumber() {
  let randomNumber = '';
  for (let i = 0; i < 9; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return parseInt(randomNumber);
}
