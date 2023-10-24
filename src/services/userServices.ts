import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const librarianRegistration = async ({
  id,
  email,
  username,
  fullname,
  mobile,
  password,
}: {
  id: number;
  email: string;
  username: string;
  fullname: string;
  mobile: string;
  password: string;
}) => {
  await isUniqueUsername(username);
  await isUniqueId(id);
  await isUniqueEmail(email);

  const hashPassword = bcrypt.hashSync(password, 10);

  const librarian = await prisma.user.create({
    data: {
      role: 'LIBRARIAN',
      email,
      username,
      password: hashPassword,
      profile: {
        create: {
          id,
          fullname,
          mobile,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return librarian;
};

export const studentRegistration = async ({
  studentId,
  email,
  fullname,
  course,
  college,
  mobile,
  password,
}: {
  studentId: number;
  email: string;
  fullname: string;
  course: string;
  college: string;
  mobile: string;
  password: string;
}): Promise<User> => {
  await isUniqueId(studentId);
  await isUniqueEmail(email);

  const hashPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      role: 'STUDENT',
      password: hashPassword,
      profile: {
        create: {
          id: studentId,
          fullname,
          course,
          college,
          mobile,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const graduateRegistration = async ({
  studentId,
  email,
  fullname,
  mobile,
  password,
}: {
  studentId: number;
  email: string;
  fullname: string;
  mobile: string;
  password: string;
}): Promise<User> => {
  await isUniqueId(studentId);
  await isUniqueEmail(email);

  const hashPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      role: 'GRADUATE',
      password: hashPassword,
      profile: {
        create: {
          id: studentId,
          fullname,
          mobile,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const teacherRegistration = async ({
  employeeId,
  email,
  fullname,
  department,
  mobile,
  password,
}: {
  employeeId: number;
  email: string;
  fullname: string;
  department: string;
  mobile: string;
  password: string;
}): Promise<User> => {
  await isUniqueId(employeeId);
  await isUniqueEmail(email);

  const hashPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      role: 'TEACHER',
      password: hashPassword,
      profile: {
        create: {
          id: employeeId,
          fullname,
          department,
          mobile,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const changePassword = async ({
  current_password,
  new_password,
  id,
}: {
  current_password: string;
  new_password: string;
  id: number;
}) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
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

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashNewPassword,
    },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

export const updateStudentProfile = async ({
  fullname,
  email,
  mobile,
  course,
  college,
  id,
}: {
  fullname: string;
  email: string;
  mobile: string;
  course: string;
  college: string;
  id: number;
}) => {
  const currentProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      AND: {
        role: 'STUDENT',
      },
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id,
      AND: {
        role: 'STUDENT',
      },
    },
    data: {
      email,
      profile: {
        update: {
          fullname,
          mobile,
          course,
          college,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return updatedProfile;
};

export const updateGraduateProfile = async ({
  fullname,
  email,
  mobile,
  id,
}: {
  fullname: string;
  email: string;
  mobile: string;
  id: number;
}) => {
  const currentProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      AND: {
        role: 'GRADUATE',
      },
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id,
      AND: {
        role: 'GRADUATE',
      },
    },
    data: {
      email,
      profile: {
        update: {
          fullname,
          mobile,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return updatedProfile;
};

export const updateTeacherProfile = async ({
  fullname,
  email,
  mobile,
  department,
  id,
}: {
  fullname: string;
  email: string;
  mobile: string;
  department: string;
  id: number;
}) => {
  const currentProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      AND: {
        role: 'TEACHER',
      },
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id,
      AND: {
        role: 'TEACHER',
      },
    },
    data: {
      email,
      profile: {
        update: {
          fullname,
          mobile,
          department,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return updatedProfile;
};

export const updateAdminProfile = async ({
  id,
  email,
  username,
}: {
  id: number;
  email: string;
  username: string;
}) => {
  const currentProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      AND: {
        role: 'ADMIN',
      },
    },
  });

  if (currentProfile.email !== email) {
    await isUniqueEmail(email);
  }
  if (currentProfile.username !== username) {
    await isUniqueUsername(username);
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id,
      AND: {
        role: 'ADMIN',
      },
    },
    data: {
      email,
      username,
    },
    include: {
      profile: true,
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
  const student = await prisma.profile.update({
    where: {
      userId: id,
    },
    data: {
      profilePhoto,
      profilePhotoId,
    },
    include: {
      user: true,
    },
  });

  return student;
};

export const getAllStudents = async () => {
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
    },
    include: {
      profile: true,
    },
  });

  const flattenResult = students.map((data) => {
    return {
      id: data.id,
      email: data.email,
      studentId: data.profile?.id.toString(), //convert to string in order to be searchable in data table
      fullname: data?.profile?.fullname,
      profilePhoto: data?.profile?.profilePhoto,
      profilePhotoId: data?.profile?.profilePhoto,
      course: data?.profile?.course,
      college: data?.profile?.college,
      mobile: data?.profile?.mobile,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  return flattenResult;
};

export const getAllLibrarians = async () => {
  const librarian = await prisma.user.findMany({
    where: {
      role: 'LIBRARIAN',
    },
    include: {
      profile: true,
    },
  });

  const flattenResult = librarian.map((data) => {
    return {
      id: data.id,
      employeeId: data.profile?.id.toString(), //convert to string in order to be searchable in data table
      email: data.email,
      username: data.username,
      fullname: data.profile?.fullname,
      mobile: data.profile?.mobile,
      profilePhoto: data.profile?.profilePhoto,
      profilePhotoId: data.profile?.profilePhotoId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  return flattenResult;
};

export const getStudentBorrowedBooks = async (id: number) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      borrowedBooks: {
        include: {
          book: true,
        },
      },
    },
  });

  return user;
};

export const suspendUser = async (id: number) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: false,
    },
  });

  return user;
};

export const unsuspendUser = async (id: number) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: true,
    },
  });

  return user;
};

const isUniqueId = async (id: number) => {
  const user = await prisma.profile.findUnique({
    where: {
      id,
    },
  });

  if (user) throw new customeError(403, 'Student ID is not valid.');
};

const isUniqueEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) throw new customeError(403, 'Email address is already in use.');
};

const isUniqueUsername = async (username: string) => {
  const librarian = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (librarian) throw new customeError(403, 'Username is already in use.');
};
