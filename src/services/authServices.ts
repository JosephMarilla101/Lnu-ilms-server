import { PrismaClient, Admin, Librarian, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserRoles } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const isActive = async ({
  id,
  role,
}: {
  id: number;
  role: UserRoles;
}): Promise<boolean> => {
  let status = false;
  if (role === 'LIBRARIAN') {
    const librarian = await prisma.librarian.findUniqueOrThrow({
      where: {
        id,
      },
    });

    status = librarian.status;
  } else if (role === 'ADMIN') {
    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        id,
      },
    });

    status = admin.status;
  } else {
    const student = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    status = student.status;
  }

  return status;
};

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

  if (!admin) throw new customeError(401, 'Invalid username or password.');

  const passwordMatch = bcrypt.compareSync(password, admin.password);

  if (!passwordMatch)
    throw new customeError(401, 'Invalid username or password.');

  if (!admin.status) throw new customeError(401, 'Your account is suspended.');

  return admin;
};

export const librarianLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<Librarian> => {
  const librarian = await prisma.librarian.findUnique({
    where: {
      username,
    },
  });

  if (!librarian) throw new customeError(401, 'Invalid email or password.');

  const passwordMatch = bcrypt.compareSync(password, librarian.password);

  if (!passwordMatch) throw new customeError(401, 'Invalid email or password.');

  if (!librarian.status)
    throw new customeError(401, 'Your account is suspended.');

  return librarian;
};

export const userLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new customeError(401, 'Invalid email or password.');

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) throw new customeError(401, 'Invalid email or password.');

  if (!user.status) throw new customeError(401, 'Your account is suspended.');

  return user;
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

export const findUser = async (id: number): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return user;
};
