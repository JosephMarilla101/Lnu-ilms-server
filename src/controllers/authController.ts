import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as authServices from '../services/authServices';
import tokenGenerator from '../utils/tokenGenerator';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const Schema = z.object({
      username: z
        .string({ required_error: 'Username is required.' })
        .min(1, 'Username is required'),
      password: z.string({ required_error: 'Password is required.' }),
    });

    const validated = Schema.parse({ username, password });

    const user = await authServices.adminLogin(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const librarianLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const Schema = z.object({
      username: z
        .string({ required_error: 'Username is required.' })
        .min(1, 'Username is required'),
      password: z.string({ required_error: 'Password is required.' }),
    });

    const validated = Schema.parse({ username, password });

    const user = await authServices.librarianLogin(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const Schema = z.object({
      email: z
        .string({ required_error: 'Email is required.' })
        .min(1, 'Email is required.'),
      password: z.string({ required_error: 'Password is required.' }),
    });

    const validated = Schema.parse({ email, password });

    const user = await authServices.userLogin(validated);

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
    const id = req.user?.id as number;

    const auth = await authServices.findUser(id);

    return res.status(200).json(auth);
  } catch (error) {
    errHandler(error, res);
  }
};
