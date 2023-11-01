import jwt from 'jsonwebtoken';
import { UserRoles } from '@prisma/client';

export type UserType = {
  id: number;
  email: string;
  role: UserRoles;
  status: boolean;
};

const tokenGenerator = (user: UserType) => {
  return jwt.sign(user, process.env.SECRET_KEY as string, {
    expiresIn: '20d',
  });
};

export default tokenGenerator;
