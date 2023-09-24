import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/jwtVerifier';
import z from 'zod';
import errHandler from '../middlewares/errorHandler';
import * as adminServices from '../services/adminServices';

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

    const updatedProfile = await adminServices.changePassword(validated);

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
    const { email, username } = req.body;
    const id = req.user?.id;

    const Schema = z.object({
      id: z.number({ required_error: 'ID is required.' }),
      email: z
        .string({ required_error: 'Email is required' })
        .email()
        .transform((value) => value.toLocaleLowerCase().trim()),
      username: z
        .string({ required_error: 'Username is required' })
        .transform((value) => value.toLocaleLowerCase().trim()),
    });

    const validated = Schema.parse({
      id,
      email,
      username,
    });

    const profile = await adminServices.updateProfile(validated);

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
      id: z.number({ required_error: 'ID is required.' }),
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

    const profile = await adminServices.updateProfilePhoto(validated);

    return res.status(200).json(profile);
  } catch (error) {
    errHandler(error, res);
  }
};
