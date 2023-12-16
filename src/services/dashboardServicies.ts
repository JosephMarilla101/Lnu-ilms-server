import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const topBookCategories = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const categories = await prisma.category.findMany({
    select: {
      name: true,
      books: {
        where: {
          borrowedBy: {
            some: {
              createdAt: {
                gte: sevenDaysAgo, // Filter books borrowed within the last 7 days
              },
            },
          },
          category: {
            some: {
              isDeleted: false,
            },
          },
        },
        select: {
          borrowedBy: true,
        },
      },
    },
  });

  // Calculate the total borrows for each category
  const categoryBorrows = categories.map((category) => {
    const totalBorrows = category.books.reduce(
      (sum, book) => sum + book.borrowedBy.length,
      0
    );
    return { name: category.name, count: totalBorrows };
  });

  // Sort categories by total borrows in descending order
  categoryBorrows.sort((a, b) => b.count - a.count);

  // Return the top 10 most borrowed categories
  return categoryBorrows.slice(0, 5);
};

export const topBorrower = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const categories = await prisma.profile.findMany({
    select: {
      department: true,
      user: {
        select: {
          borrowedBooks: {
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
        },
      },
    },
  });

  // Calculate the total borrows for each category
  // const categoryBorrows = categories.map((category) => {
  //   const totalBorrows = category.books.reduce(
  //     (sum, book) => sum + book.borrowedBy.length,
  //     0
  //   );
  //   return { name: category.name, count: totalBorrows };
  // });

  // Sort categories by total borrows in descending order
  // categoryBorrows.sort((a, b) => b.count - a.count);

  // Return the top 10 most borrowed categories
  // return categoryBorrows.slice(0, 5);
};

export const userBorrowCount = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const roles = ['STUDENT', 'GRADUATE', 'TEACHER'] as const;

  const dataset = await Promise.all(
    roles.map(async (role) => {
      const count = await prisma.borrowedBook.count({
        where: {
          user: {
            role,
          },
          createdAt: {
            gte: sevenDaysAgo, // Filter books borrowed within the last 7 days
          },
        },
      });

      return { name: role, count };
    })
  );

  return dataset;
};

export const userCountData = async () => {
  const roles = ['STUDENT', 'GRADUATE', 'TEACHER', 'LIBRARIAN'] as const;

  const dataset = await Promise.all(
    roles.map(async (role) => {
      const count = await prisma.user.count({
        where: {
          role,
        },
      });

      return { name: role, count };
    })
  );

  return dataset;
};

export const totalBooks = async (): Promise<number> => {
  const total = await prisma.book.count();

  return total;
};

export const totalUnreturnedBooks = async (): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      isReturn: false,
    },
  });

  return total;
};

export const myTotalUnreturnedBooks = async (
  userId: number
): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      isReturn: false,
      AND: {
        userId,
      },
    },
  });

  return total;
};

export const totalRequestedBooks = async (): Promise<number> => {
  const total = await prisma.borrowRequest.count({
    where: {
      status: {
        not: 'RELEASED',
      },
    },
  });

  return total;
};

export const myTotalRequestedBooks = async (
  userId: number
): Promise<number> => {
  const total = await prisma.borrowRequest.count({
    where: {
      status: {
        not: 'RELEASED',
      },
      AND: {
        userId,
      },
    },
  });

  return total;
};

export const totalBorrowedBooks = async (): Promise<number> => {
  const total = await prisma.borrowedBook.count();

  return total;
};

export const myTotalBorrowedBooks = async (userId: number): Promise<number> => {
  const total = await prisma.borrowedBook.count({
    where: {
      userId,
    },
  });

  return total;
};

export const totalAuthors = async (): Promise<number> => {
  const total = await prisma.author.count({
    where: {
      isDeleted: false,
    },
  });

  return total;
};

export const totalCatoegories = async (): Promise<number> => {
  const total = await prisma.category.count({
    where: {
      isDeleted: false,
    },
  });

  return total;
};

export const totalStudents = async (): Promise<number> => {
  const total = await prisma.user.count({
    where: {
      role: 'STUDENT',
    },
  });

  return total;
};

export const totalGraduates = async (): Promise<number> => {
  const total = await prisma.user.count({
    where: {
      role: 'GRADUATE',
    },
  });

  return total;
};

export const totalTeachers = async (): Promise<number> => {
  const total = await prisma.user.count({
    where: {
      role: 'TEACHER',
    },
  });

  return total;
};

export const totalLibrarians = async (): Promise<number> => {
  const total = await prisma.user.count({
    where: {
      role: 'LIBRARIAN',
    },
  });

  return total;
};
