import jwt from 'jsonwebtoken';

export type UserType = {
  id: number;
  email: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'STUDENT';
  status: boolean;
};

const tokenGenerator = (user: UserType) => {
  return jwt.sign(user, process.env.SECRET_KEY as string, {
    expiresIn: '20d',
  });
};

export default tokenGenerator;
