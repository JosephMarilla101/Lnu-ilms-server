import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import errHandler from '../middlewares/errorHandler';
import * as dashboardServicies from '../services/dashboardServicies';

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
