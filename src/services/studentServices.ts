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

export const changePassword = async ({
  current_password,
  new_password,
  userId,
}: {
  current_password: string;
  new_password: string;
  userId: number;
}) => {
  const user = await prisma.student.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const isCurrentPasswordValid = bcrypt.compareSync(
    current_password,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new customeError(401, 'Current password is incorrect');
  }

  const hashNewPassword = bcrypt.hashSync(new_password, 10);

  const updatedProfile = await prisma.student.update({
    where: {
      id: userId,
    },
    data: {
      password: hashNewPassword,
    },
  });

  return updatedProfile;
};

export const updateProfile = async ({
  fullname,
  email,
  mobile,
  course,
  college,
  studentId,
}: {
  fullname: string;
  email: string;
  mobile: string;
  course: string;
  college: string;
  studentId: number;
}) => {
  const currentProfile = await prisma.student.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }

  const updatedProfile = await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      fullname,
      email,
      mobile,
      course,
      college,
    },
  });

  return updatedProfile;
};

export const updateProfilePhoto = async ({
  id,
  profilePhoto,
  profilePhotoId,
}: {
  id: number;
  profilePhoto: string;
  profilePhotoId: string;
}) => {
  const student = await prisma.student.update({
    where: {
      id,
    },
    data: {
      profilePhoto,
      profilePhotoId,
    },
  });

  return student;
};

export const getAllStudents = async () => {
  const students = await prisma.student.findMany();

  const flattenResult = students.map((data) => {
    return {
      id: data.id,
      studentId: data.studentId.toString(), //convert to string in order to be searchable in data table
      email: data.email,
      fullname: data.fullname,
      profilePhoto: data.profilePhoto,
      profilePhotoId: data.profilePhoto,
      course: data.course,
      college: data.college,
      mobile: data.mobile,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  return flattenResult;
};

export const suspendStudent = async (id: number) => {
  const student = await prisma.student.update({
    where: {
      id,
    },
    data: {
      status: false,
    },
  });

  return student;
};

export const unsuspendStudent = async (id: number) => {
  const student = await prisma.student.update({
    where: {
      id,
    },
    data: {
      status: true,
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
