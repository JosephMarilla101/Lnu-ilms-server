import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as categoryServices from '../services/categoryServices';
import customeError from '../utils/customError';

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, status } = req.body;

    const Schema = z.object({
      name: z.string({ required_error: 'Author name is required.' }),
      status: z.boolean({ required_error: 'Category status is required.' }),
    });

    const validated = Schema.parse({ name, status });

    const category = await categoryServices.createCategory(validated);

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id, name, status } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Category ID is required.' }),
      name: z.string({ required_error: 'Category name is required.' }),
      status: z.boolean({ required_error: 'Category status is required.' }),
    });

    const validated = Schema.parse({ id, name, status });

    const category = await categoryServices.updateCategory(validated);

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'Category ID is required.' }),
    });

    const validated = Schema.parse({ id });

    const category = await categoryServices.deleteCategory(validated.id);

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.query.id;

    const Schema = z.object({
      id: z
        .string({
          required_error: 'Category ID is required.',
          invalid_type_error: 'Category ID is not a valid ID.',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ id });

    if (!validated.id) throw new customeError(403, 'Category ID is required.');

    const category = await categoryServices.getCategory(validated.id);

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getALLCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const category = await categoryServices.getALLCategories();

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getActiveCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const category = await categoryServices.getActiveCategories();

    return res.status(200).json(category);
  } catch (error) {
    errHandler(error, res);
  }
};
