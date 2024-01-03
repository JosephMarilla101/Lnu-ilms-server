import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as dashboardServicies from '../services/dashboardServicies';
import { isValidDateString } from '../utils/lib';

export const getBorrowedBookCountByMonth = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const year = req.query.year;

    const Schema = z.object({
      year: z
        .string()
        .refine((value) => parseInt(value), {
          message: 'Invalid year filter',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ year });

    const data = await dashboardServicies.getBorrowedBookCountByMonth(
      validated.year
    );

    return res.status(200).json(data);
  } catch (error) {
    errHandler(error, res);
  }
};

export const topBookCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const year = req.query.year;

    const Schema = z.object({
      year: z
        .string()
        .refine((value) => parseInt(value), {
          message: 'Invalid year filter',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ year });

    const data = await dashboardServicies.topBookCategories(validated.year);

    return res.status(200).json(data);
  } catch (error) {
    errHandler(error, res);
  }
};

export const userBorrowCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const Schema = z.object({
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

    const validated = Schema.parse({ startDate, endDate });

    const data = await dashboardServicies.userBorrowCount(validated);

    return res.status(200).json(data);
  } catch (error) {
    errHandler(error, res);
  }
};

export const userCountData = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const data = await dashboardServicies.userCountData();

    return res.status(200).json(data);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalBooks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const total = await dashboardServicies.totalBooks();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalUnreturnedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalUnreturnedBooks();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const myTotalUnreturnedBooks = async (
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

    const total = await dashboardServicies.myTotalUnreturnedBooks(
      validated.studentId
    );

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalRequestedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalRequestedBooks();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const myTotalRequestedBooks = async (
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

    const total = await dashboardServicies.myTotalRequestedBooks(
      validated.studentId
    );

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalBorrowedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalBorrowedBooks();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const myTotalBorrowedBooks = async (
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

    const total = await dashboardServicies.myTotalBorrowedBooks(
      validated.studentId
    );

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalAuthors = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalAuthors();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalCatoegories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalCatoegories();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalStudents = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalStudents();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalGraduates = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalGraduates();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalTeachers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalTeachers();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};

export const totalLibrarians = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const total = await dashboardServicies.totalLibrarians();

    return res.status(200).json(total);
  } catch (error) {
    errHandler(error, res);
  }
};
