import jwt from 'jsonwebtoken';

type UserType = {
  id: number;
  email: string;
};

const tokenGenerator = (user: UserType) => {
  return jwt.sign(user, process.env.SECRET_KEY as string, {
    expiresIn: '1d',
  });
};

export default tokenGenerator;
