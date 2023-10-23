import { PrismaClient, User } from '@prisma/client';
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
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return user.status;
};

export const adminLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<User> => {
  const admin = await prisma.user.findUnique({
    where: {
      username,
      AND: {
        role: 'ADMIN',
      },
    },
    include: {
      profile: true,
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
}): Promise<User> => {
  const librarian = await prisma.user.findUnique({
    where: {
      username,
      AND: {
        role: 'LIBRARIAN',
      },
    },
    include: {
      profile: true,
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
    include: {
      profile: true,
    },
  });

  if (!user) throw new customeError(401, 'Invalid email or password.');

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) throw new customeError(401, 'Invalid email or password.');

  if (!user.status) throw new customeError(401, 'Your account is suspended.');

  return user;
};

export const findUser = async (id: number): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });

  return user;
};
