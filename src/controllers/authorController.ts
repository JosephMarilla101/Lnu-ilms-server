import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as authorServices from '../services/authorServices';
import customeError from '../utils/customError';

export const createAuthor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name } = req.body;

    const Schema = z.object({
      name: z.string({ required_error: 'Author name is required.' }),
    });

    const validated = Schema.parse({ name });

    const author = await authorServices.createAuthor(validated.name);

    return res.status(200).json(author);
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateAuthor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id, name, status } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Author ID is required.' }),
      name: z.string({ required_error: 'Author name is required.' }),
      status: z.boolean({ required_error: 'Author status is required.' }),
    });

    const validated = Schema.parse({ id, name, status });

    const author = await authorServices.updateAuthor(validated);

    return res.status(200).json(author);
  } catch (error) {
    errHandler(error, res);
  }
};

export const deleteAuthor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Author ID is required.' }),
    });

    const validated = Schema.parse({ id });

    const author = await authorServices.deleteAuthor(validated.id);

    return res.status(200).json(author);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getAuthor = async (req: AuthenticatedRequest, res: Response) => {
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

    const author = await authorServices.getAuthor(validated.id);

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

export const getActiveAuthors = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const authors = await authorServices.getActiveAuthors();

    return res.status(200).json(authors);
  } catch (error) {
    errHandler(error, res);
  }
};
