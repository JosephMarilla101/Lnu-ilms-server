import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as authorServices from '../services/authorServices';

export const createAuthor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name } = req.body;

    const Schema = z.object({
      name: z.string({ required_error: 'Author name is required' }),
    });

    const validated = Schema.parse({ name });

    const author = await authorServices.createAuthor(validated.name);

    return res.status(200).json(author);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getALLAuthors = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const authors = await authorServices.getALLAuthors();

    return res.status(200).json(authors);
  } catch (error) {
    errHandler(error, res);
  }
};
