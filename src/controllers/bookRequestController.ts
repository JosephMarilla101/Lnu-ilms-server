import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import { RequestType } from '@prisma/client';
import z from 'zod';
import * as bookRequestServices from '../services/bookRequestServices';
import errHandler from '../middlewares/errorHandler';
import { isValidDateString } from '../utils/lib';

export const getALLRequestedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const RequestTypeEnum = {
      PENDING: 'PENDING' as const,
      DISAPPROVED: 'DISAPPROVED' as const,
      CANCELLED: 'CANCELLED' as const,
      FORPICKUP: 'FORPICKUP' as const,
      RELEASED: 'RELEASED' as const,
    };

    const Schema = z.object({
      status: z.nativeEnum(RequestTypeEnum, {
        required_error: 'Status is required.',
        invalid_type_error: 'Invalid request status.',
      }),
      startDate: z
        .string()
        .refine((value) => isValidDateString(value), {
          message: 'Invalid start date filter',
        })
        .transform((value) => new Date(value).toISOString()),
      endDate: z
        .string()
        .refine((value) => isValidDateString(value), {
          message: 'Invalid end date filter',
        })
        .transform((value) => new Date(value).toISOString()),
    });

    const validated = Schema.parse({ status, startDate, endDate });

    const boookRequests = await bookRequestServices.getALLRequestedBooks(
      validated
    );

    return res.status(200).json(boookRequests);
  } catch (error) {
    errHandler(error, res);
  }
};
