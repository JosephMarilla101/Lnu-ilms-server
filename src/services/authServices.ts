import { PrismaClient, Admin, Librarian, Student } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const adminLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<Admin> => {
  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (!admin) throw new customeError(401, 'Invalid username or password');

  const passwordMatch = bcrypt.compareSync(password, admin.password);

  if (!passwordMatch)
    throw new customeError(401, 'Invalid username or password');

  return admin;
};

export const librarianLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Librarian> => {
  const librarian = await prisma.librarian.findUnique({
    where: {
      email,
    },
  });

  if (!librarian) throw new customeError(401, 'Invalid email or password');

  const passwordMatch = bcrypt.compareSync(password, librarian.password);

  if (!passwordMatch) throw new customeError(401, 'Invalid email or password');

  return librarian;
};

export const studentLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Student> => {
  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });

  if (!student) throw new customeError(401, 'Invalid email or password.');

  const passwordMatch = bcrypt.compareSync(password, student.password);

  if (!passwordMatch) throw new customeError(401, 'Invalid email or password.');

  return student;
};

export const findAdmin = async (id: number): Promise<Admin> => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return admin;
};

export const findLibrarian = async (id: number): Promise<Librarian> => {
  const librarian = await prisma.librarian.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return librarian;
};

export const findStudent = async (id: number): Promise<Student> => {
  const student = await prisma.student.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return student;
};
