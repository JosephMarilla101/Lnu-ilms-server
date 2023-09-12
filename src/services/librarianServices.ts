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
