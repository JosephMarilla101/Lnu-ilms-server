import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import errHandler from '../middlewares/errorHandler';

export const generateISBM = (req: AuthenticatedRequest, res: Response) => {
  try {
  } catch (error) {
    errHandler(error, res);
  }
};
