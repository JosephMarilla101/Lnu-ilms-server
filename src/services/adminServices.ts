import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await prisma.admin.findFirst({
    where: {
      username,
    },
  });

  if (!user) throw new customeError(401, 'Invalid username or password');

  const passwordMatch = await bcrypt.compareSync(password, user.password);

  if (!passwordMatch)
    throw new customeError(401, 'Invalid username or password');

  const parseUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return parseUser;
};
