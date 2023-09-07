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
  await isUniqueEmail(email);

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

const isUniqueStudentId = async (studentId: number) => {
  const student = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  if (student) throw new customeError(403, 'Student ID is not valid.');
};

const isUniqueEmail = async (email: string) => {
  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });

  if (student) throw new customeError(403, 'Email address is already in use.');
};
