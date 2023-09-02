import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as authServices from '../services/authServices';
import tokenGenerator from '../utils/tokenGenerator';
import customeError from '../utils/customError';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const Schema = z.object({
      username: z
        .string({ required_error: 'Username is required' })
        .min(1, 'Username is required'),
      password: z.string({ required_error: 'Password is required' }),
    });

    const validated = Schema.parse({ username, password });

    const user = await authServices.adminLogin(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (user?.role === 'ADMIN') {
      const auth = await authServices.findAdmin(user.id);

      return res.status(200).json(auth);
    }

    if (user?.role === 'LIBRARIAN') {
      const auth = await authServices.findLibrarian(user.id);

      return res.status(200).json(auth);
    }

    if (user?.role === 'STUDENT') {
      const auth = await authServices.findStudent(user.id);

      return res.status(200).json(auth);
    }

    throw new customeError(404, 'Unauthorize');
  } catch (error) {
    errHandler(error, res);
  }
};
