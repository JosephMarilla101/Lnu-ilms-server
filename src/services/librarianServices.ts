import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const librarianRegistration = async ({
  employeeId,
  email,
  username,
  fullname,
  mobile,
  password,
}: {
  employeeId: number;
  email: string;
  username: string;
  fullname: string;
  mobile: string;
  password: string;
}) => {
  await isUniqueEmployeeId(employeeId);
  await isUniqueUsername(username);
  await isUniqueEmail(email);

  const hashPassword = bcrypt.hashSync(password, 10);

  const librarian = await prisma.librarian.create({
    data: {
      employeeId,
      email,
      username,
      fullname,
      mobile,
      password: hashPassword,
    },
  });

  return librarian;
};

export const changePassword = async ({
  current_password,
  new_password,
  userId,
}: {
  current_password: string;
  new_password: string;
  userId: number;
}) => {
  const user = await prisma.librarian.findUniqueOrThrow({
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

  const updatedProfile = await prisma.librarian.update({
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
  username,
  fullname,
  email,
  mobile,
  librarianId,
}: {
  username: string;
  fullname: string;
  email: string;
  mobile: string;
  librarianId: number;
}) => {
  const currentProfile = await prisma.librarian.findUniqueOrThrow({
    where: {
      id: librarianId,
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }

  if (currentProfile.username !== username) {
    await isUniqueUsername(username);
  }

  const updatedProfile = await prisma.librarian.update({
    where: {
      id: librarianId,
    },
    data: {
      username,
      fullname,
      email,
      mobile,
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
  const librarian = await prisma.librarian.update({
    where: {
      id,
    },
    data: {
      profilePhoto,
      profilePhotoId,
    },
  });

  return librarian;
};

export const getAllLibrarians = async () => {
  const librarian = await prisma.librarian.findMany();

  const flattenResult = librarian.map((data) => {
    return {
      id: data.id,
      employeeId: data.employeeId.toString(), //convert to string in order to be searchable in data table
      email: data.email,
      username: data.username,
      fullname: data.fullname,
      mobile: data.mobile,
      profilePhoto: data.profilePhoto,
      profilePhotoId: data.profilePhotoId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  return flattenResult;
};

export const suspendLibrarian = async (id: number) => {
  const librarian = await prisma.librarian.update({
    where: {
      id,
    },
    data: {
      status: false,
    },
  });

  return librarian;
};

export const unsuspendLibrarian = async (id: number) => {
  const librarian = await prisma.librarian.update({
    where: {
      id,
    },
    data: {
      status: true,
    },
  });

  return librarian;
};

const isUniqueEmployeeId = async (employeeId: number) => {
  const librarian = await prisma.librarian.findUnique({
    where: {
      employeeId,
    },
  });

  if (librarian) throw new customeError(403, 'Employee ID is not valid.');
};

const isUniqueEmail = async (email: string) => {
  const librarian = await prisma.librarian.findUnique({
    where: {
      email,
    },
  });

  if (librarian)
    throw new customeError(403, 'Email address is already in use.');
};

const isUniqueUsername = async (username: string) => {
  const librarian = await prisma.librarian.findUnique({
    where: {
      username,
    },
  });

  if (librarian) throw new customeError(403, 'Username is already in use.');
};
