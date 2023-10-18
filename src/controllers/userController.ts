import { Request, Response } from 'express';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as userServices from '../services/userServices';
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
    const isStuentIdValid = /^[0-9]+$/.test(studentId);

    if (!isStuentIdValid) {
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

    const user = await userServices.studentRegistration(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user: user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const graduateRegistration = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      email,
      fullname,
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
    const isStuentIdValid = /^[0-9]+$/.test(studentId);

    if (!isStuentIdValid) {
      throw new customError(403, 'Student ID should only contain digits.');
    }

    const validated = Schema.parse({
      studentId,
      email,
      fullname,
      mobile,
      password,
      password_confirmation,
    });

    if (!validated.studentId)
      throw new customeError(403, 'Student ID is not a valid ID.');

    const user = await userServices.graduateRegistration(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user: user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const teacherRegistration = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      email,
      fullname,
      department,
      mobile,
      password,
      password_confirmation,
    } = req.body;

    const Schema = z
      .object({
        employeeId: z
          .string({ required_error: 'Employee ID is required.' })
          .min(4, {
            message: 'Employee ID must be at least 4 characters.',
          })
          .max(8, { message: 'Employee ID must not exceed 8 characters.' })
          .transform((value) => parseInt(value)),
        email: z
          .string({ required_error: 'Email is required' })
          .email()
          .transform((value) => value.toLocaleLowerCase().trim()),
        fullname: z
          .string({ required_error: 'Full Name is required.' })
          .transform((value) => value.trim()),
        department: z
          .string({ required_error: 'Department is required.' })
          .min(1, {
            message: 'Department is required.',
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
    const isEmployeeIdValid = /^[0-9]+$/.test(employeeId);

    if (!isEmployeeIdValid) {
      throw new customError(403, 'Student ID should only contain digits.');
    }

    const validated = Schema.parse({
      employeeId,
      email,
      fullname,
      department,
      mobile,
      password,
      password_confirmation,
    });

    if (!validated.employeeId)
      throw new customeError(403, 'Student ID is not a valid ID.');

    const user = await userServices.teacherRegistration(validated);

    const token = tokenGenerator(user);

    return res.status(200).json({ user: user, token });
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
    const id = req.user?.id;

    const Schema = z
      .object({
        id: z.number({ required_error: 'User ID is required.' }),
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
      id,
    });

    const updatedProfile = await userServices.changePassword(validated);

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
    const { email, fullname, mobile, course, college, department } = req.body;
    const id = req.user?.id;

    const Schema = z.object({
      id: z.number({ required_error: 'Student ID is required.' }),
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
      department: z
        .string({ required_error: 'Department is required.' })
        .min(1, {
          message: 'Department is required.',
        }),
      mobile: z.string({ required_error: 'Mobile number is required.' }),
    });

    const validated = Schema.parse({
      id,
      email,
      fullname,
      course,
      college,
      department,
      mobile,
    });

    const profile = await userServices.updateProfile(validated);

    return res.status(200).json(profile);
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateProfilePhoto = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { profilePhoto, profilePhotoId } = req.body;
    const id = req.user?.id;

    const Schema = z.object({
      id: z.number({ required_error: 'Student ID is required.' }),
      profilePhoto: z.string({
        required_error: 'profilePhoto is required.',
      }),
      profilePhotoId: z.string({
        required_error: 'profilePhotoId is required.',
      }),
    });

    const validated = Schema.parse({
      id,
      profilePhoto,
      profilePhotoId,
    });

    const profile = await userServices.updateProfilePhoto(validated);

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
    const students = await userServices.getAllStudents();

    return res.status(200).json(students);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getStudentBorrowedBooks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = req.params.id;

    const Schema = z.object({
      id: z
        .string({
          required_error: 'Student ID is required',
          invalid_type_error: 'Student ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ id });

    const student = await userServices.getStudentBorrowedBooks(validated.id);

    return res.status(200).json(student);
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

    const student = await userServices.suspendUser(validated.id);

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

    const student = await userServices.unsuspendUser(validated.id);

    return res.status(200).json(student);
  } catch (error) {
    errHandler(error, res);
  }
};
