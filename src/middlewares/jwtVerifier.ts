import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import errHandler from './errorHandler';
import customeError from '../utils/customError';
import { UserType } from '../utils/tokenGenerator';

export interface AuthenticatedRequest extends Request {
  user?: UserType;
}

const jwtVerifier = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new customeError(401, 'Unauthorize, No token');
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as UserType;

    req.user = decoded;

    next();
  } catch (error) {
    errHandler(error, res);
  }
};

export default jwtVerifier;
