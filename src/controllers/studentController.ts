import { Request, Response } from 'express';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as studentServices from '../services/studentServices';
import customeError from '../utils/customError';
import tokenGenerator from '../utils/tokenGenerator';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import customError from '../utils/customError';

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
          .string({ required_error: 'Student ID is required.' })
          .min(4, {
            message: 'Student ID must be at least 4 characters.',
          })
          .max(8, { message: 'Student ID must not exceed 8 characters.' })
          .transform((value) => parseInt(value)),
        email: z
          .string({ required_error: 'Email is required' })
          .email()
          .transform((value) => value.toLocaleLowerCase().trim()),
        fullname: z
          .string({ required_error: 'Full Name is required.' })
          .transform((value) => value.trim()),
        course: z.string({ required_error: 'Course is required.' }).min(1, {
          message: 'Course is required.',
        }),
        college: z.string({ required_error: 'College is required.' }).min(1, {
          message: 'College is required.',
        }),
        mobile: z.string({ required_error: 'Mobile number is required.' }),
        password: z
          .string({ required_error: 'Password is required.' })
          .min(6, 'Password must contain at least 6 character(s).')
          .transform((value) => value.trim()),
        password_confirmation: z
          .string({
            required_error: 'Password confimation is required.',
          })
          .transform((value) => value.trim()),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match.',
        path: ['password_confirmation'],
      });

    // Regular expression to check if the studentId contains only digits
    const isEmployeeIdValid = /^[0-9]+$/.test(studentId);

    if (!isEmployeeIdValid) {
      throw new customError(403, 'Student ID should only contain digits.');
    }

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
      throw new customeError(403, 'Student ID is not a valid ID.');

    const student = await studentServices.studentRegistration(validated);

    const token = tokenGenerator(student);

    return res.status(200).json({ user: student, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { current_password, new_password, password_confirmation } = req.body;
    const userId = req.user?.id;

    const Schema = z
      .object({
        userId: z.number({ required_error: 'User ID is required.' }),
        current_password: z
          .string({ required_error: 'Current Password is required.' })
          .transform((value) => value.trim()),
        new_password: z
          .string({ required_error: 'New Password is required.' })
          .min(6, 'New Password must contain at least 6 character(s).')
          .transform((value) => value.trim()),
        password_confirmation: z
          .string({
            required_error: 'Password confimation is required.',
          })
          .transform((value) => value.trim()),
      })
      .refine((data) => data.new_password === data.password_confirmation, {
        message: 'Passwords do not match.',
        path: ['password_confirmation'],
      });

    const validated = Schema.parse({
      current_password,
      new_password,
      password_confirmation,
      userId,
    });

    const updatedProfile = await studentServices.changePassword(validated);

    return res.status(200).json(updatedProfile);
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { email, fullname, mobile, course, college } = req.body;
    const studentId = req.user?.id;

    const Schema = z.object({
      studentId: z.number({ required_error: 'Student ID is required.' }),
      email: z
        .string({ required_error: 'Email is required' })
        .email()
        .transform((value) => value.toLocaleLowerCase().trim()),
      fullname: z
        .string({ required_error: 'Full Name is required.' })
        .min(1, {
          message: 'Course is required.',
        })
        .transform((value) => value.trim()),
      course: z.string({ required_error: 'Course is required.' }).min(1, {
        message: 'Course is required.',
      }),
      college: z.string({ required_error: 'College is required.' }).min(1, {
        message: 'College is required.',
      }),
      mobile: z.string({ required_error: 'Mobile number is required.' }),
    });

    const validated = Schema.parse({
      studentId,
      email,
      fullname,
      course,
      college,
      mobile,
    });

    const profile = await studentServices.updateProfile(validated);

    return res.status(200).json(profile);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getAllStudents = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const students = await studentServices.getAllStudents();

    return res.status(200).json(students);
  } catch (error) {
    errHandler(error, res);
  }
};

export const suspendStudent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'ID is required.' }),
    });

    const validated = Schema.parse({
      id,
    });

    const student = await studentServices.suspendStudent(validated.id);

    return res.status(200).json(student);
  } catch (error) {
    errHandler(error, res);
  }
};

export const unsuspendStudent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.body;

    const Schema = z.object({
      id: z.number({ required_error: 'ID is required.' }),
    });

    const validated = Schema.parse({
      id,
    });

    const student = await studentServices.unsuspendStudent(validated.id);

    return res.status(200).json(student);
  } catch (error) {
    errHandler(error, res);
  }
};
