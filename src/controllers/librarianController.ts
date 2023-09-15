import { Request, Response } from 'express';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as librarianServices from '../services/librarianServices';
import customeError from '../utils/customError';
import tokenGenerator from '../utils/tokenGenerator';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import customError from '../utils/customError';

export const librarianRegistration = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      email,
      username,
      fullname,
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
        username: z
          .string({ required_error: 'Username is required' })
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

    // Regular expression to check if the employeeId contains only digits
    const isEmployeeIdValid = /^[0-9]+$/.test(employeeId);

    if (!isEmployeeIdValid) {
      throw new customError(403, 'Employee ID should only contain digits.');
    }

    const validated = Schema.parse({
      employeeId,
      email,
      username,
      fullname,
      mobile,
      password,
      password_confirmation,
    });

    if (!validated.employeeId)
      throw new customeError(403, 'Employee ID is not a valid ID.');

    const librarian = await librarianServices.librarianRegistration(validated);

    const token = tokenGenerator(librarian);

    return res.status(200).json({ user: librarian, token });
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

    const updatedProfile = await librarianServices.changePassword(validated);

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
    const { email, fullname, mobile, username } = req.body;
    const librarianId = req.user?.id;

    const Schema = z.object({
      librarianId: z.number({ required_error: 'Librarian ID is required.' }),
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
      mobile: z.string({ required_error: 'Mobile number is required.' }),
      username: z
        .string({ required_error: 'Username is required' })
        .transform((value) => value.trim()),
    });

    const validated = Schema.parse({
      librarianId,
      email,
      fullname,
      mobile,
      username,
    });

    const profile = await librarianServices.updateProfile(validated);

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
      id: z.number({ required_error: 'Librarian ID is required.' }),
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

    const profile = await librarianServices.updateProfilePhoto(validated);

    return res.status(200).json(profile);
  } catch (error) {
    errHandler(error, res);
  }
};

export const getAllLibrarians = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const librarians = await librarianServices.getAllLibrarians();

    return res.status(200).json(librarians);
  } catch (error) {
    errHandler(error, res);
  }
};

export const suspendLibrarian = async (
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

    const librarian = await librarianServices.suspendLibrarian(validated.id);

    return res.status(200).json(librarian);
  } catch (error) {
    errHandler(error, res);
  }
};

export const unsuspendLibrarian = async (
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

    const librarian = await librarianServices.unsuspendLibrarian(validated.id);

    return res.status(200).json(librarian);
  } catch (error) {
    errHandler(error, res);
  }
};
