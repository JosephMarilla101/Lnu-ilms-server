import { PrismaClient, Student } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const studentRegistration = async ({
  studentId,
  fullname,
  course,
  college,
  mobile,
  email,
  password,
}: {
  studentId: number;
  fullname: string;
  course: string;
  college: string;
  mobile: string;
  email: string;
  password: string;
}): Promise<Student> => {
  await isUniqueStudentId(studentId);

  const hashPassword = bcrypt.hashSync(password, 10);

  const student = await prisma.student.create({
    data: {
      studentId,
      email,
      fullname,
      course,
      college,
      mobile,
      password: hashPassword,
    },
  });

  return student;
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

const isUniqueStudentId = async (studentId: number) => {
  const student = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  if (student) throw new customeError(403, 'Student ID is not valid');
};
