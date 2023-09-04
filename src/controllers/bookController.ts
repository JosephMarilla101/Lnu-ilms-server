import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import * as bookServices from '../services/bookServices';
import errHandler from '../middlewares/errorHandler';

export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, bookCover, bookCoverId, authorId, categoryIds, stock } =
      req.body;

    const isbn = await generateUniqueISBN();

    const Schema = z.object({
      name: z.string({ invalid_type_error: 'Book name must be a string' }),
      bookCover: z
        .string({ invalid_type_error: 'bookCover must be a string' })
        .optional(),
      bookCoverId: z
        .string({ invalid_type_error: 'bookCoverId must be a string' })
        .optional(),
      authorId: z.number({
        required_error: 'Author ID is required',
        invalid_type_error: 'Author ID is not a valid ID',
      }),
      categoryIds: z.array(
        z.number({
          invalid_type_error: 'categoryIds must be an array of numbers',
        })
      ),
      stock: z.number(),
      isbn: z.number({ invalid_type_error: 'isbn must be a unique number' }),
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
