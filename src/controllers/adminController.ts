import { Request, Response } from 'express';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as adminServices from '../services/adminServices';
import tokenGenerator from '../utils/tokenGenerator';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const Schema = z.object({
      username: z.string({ required_error: 'Username is required' }),
      password: z.string({ required_error: 'Password is required' }),
    });

    const validated = Schema.parse({ username, password });

    const user = await adminServices.login(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ token });
  } catch (error) {
    errHandler(error, res);
  }
};
