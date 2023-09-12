import { Request, Response, NextFunction } from 'express';
import { isActive } from '../services/authServices';
import errHandler from './errorHandler';
import customeError from '../utils/customError';
import { UserType } from '../utils/tokenGenerator';

export interface AuthenticatedRequest extends Request {
  user?: UserType;
}

const studentVerifier = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) throw new customeError(401, 'Unauthenticated user.');

    const status = await isActive({ id: user.id, role: user.role });

    if (!status) throw new customeError(401, 'Account suspended.');

    next();
  } catch (error) {
    errHandler(error, res);
  }
};

export default studentVerifier;
