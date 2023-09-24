import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const changePassword = async ({
  current_password,
  new_password,
  userId,
}: {
  current_password: string;
  new_password: string;
  userId: number;
}) => {
  const user = await prisma.admin.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const isCurrentPasswordValid = bcrypt.compareSync(
    current_password,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new customeError(401, 'Current password is incorrect');
  }

  const hashNewPassword = bcrypt.hashSync(new_password, 10);

  const updatedProfile = await prisma.admin.update({
    where: {
      id: userId,
    },
    data: {
      password: hashNewPassword,
    },
  });

  return updatedProfile;
};

export const updateProfile = async ({
  id,
  email,
  username,
}: {
  id: number;
  email: string;
  username: string;
}) => {
  const currentProfile = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedProfile = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      email,
      username,
    },
  });

  return updatedProfile;
};

export const updateProfilePhoto = async ({
  id,
  profilePhoto,
  profilePhotoId,
}: {
  id: number;
  profilePhoto: string;
  profilePhotoId: string;
}) => {
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      profilePhoto,
      profilePhotoId,
    },
  });

  return admin;
};
