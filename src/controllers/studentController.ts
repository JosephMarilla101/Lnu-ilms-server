import { Request, Response } from 'express';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as studentServices from '../services/studentServices';
import customeError from '../utils/customError';

export const studentRegistration = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      email,
      fullname,
      course,
      college,
      mobile,
      password,
      password_confirmation,
    } = req.body;

    const Schema = z
      .object({
        studentId: z
          .string({ required_error: 'Student ID is required' })
          .min(4, {
            message: 'Student ID must be at least 4 characters.',
          })
          .max(8, { message: 'Student ID must not exceed 8 characters' })
          .transform((value) => parseInt(value)),
        email: z.string({ required_error: 'Email is required' }).email(),
        fullname: z.string({ required_error: 'Full Name is required' }),
        course: z.string({ required_error: 'Course is required' }),
        college: z.string({ required_error: 'College is required' }),
        mobile: z.string({ required_error: 'Mobile number is required' }),
        password: z
          .string({ required_error: 'Password is required' })
          .min(6, 'Password must contain at least 6 character(s)')
          .transform((value) => value.trim()),
        password_confirmation: z
          .string({
            required_error: 'Password confimation is required',
          })
          .transform((value) => value.trim()),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });

    const validated = Schema.parse({
      studentId,
      email,
      fullname,
      course,
      college,
      mobile,
      password,
      password_confirmation,
    });

    if (!validated.studentId)
      throw new customeError(403, 'Student ID is not a valid ID');

    const student = await studentServices.studentRegistration(validated);

    return res.status(200).json(student);
  } catch (error) {
    errHandler(error, res);
  }
};
