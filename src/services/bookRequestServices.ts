import { PrismaClient, RequestType } from '@prisma/client';

const prisma = new PrismaClient();
export const getALLRequestedBooks = async ({
  status,
  startDate,
  endDate,
}: {
  status: RequestType | 'CANCELLED';
  startDate: string;
  endDate: string;
}) => {
  const pendingBooks = await prisma.borrowRequest.findMany({
    where: {
      ...(status === 'CANCELLED'
        ? { isCancelled: true, AND: { status: { not: 'DISAPPROVED' } } }
        : status === 'DISAPPROVED'
        ? { status: 'DISAPPROVED' }
        : { status: status, AND: { isCancelled: false } }),
      requestDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      bookId: true,
      userId: true,
      book: {
        select: {
          name: true,
          isbn: true,
          bookCover: true,
          copies: true,
        },
      },
      user: {
        select: {
          profile: {
            select: {
              id: true,
            },
          },
        },
      },
      status: true,
      isCancelled: true,
      requestDate: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const flattenResult = pendingBooks.map((data) => {
    return {
      id: data.id,
      bookId: data.bookId,
      bookName: data.book.name,
      bookCover: data.book.bookCover,
      copies: data.book.copies,
      isbn: data.book.isbn.toString(), //convert to string in order to be searchable in data table
      studentId: data.user.profile?.id.toString(), //convert to string in order to be searchable in data table
      borrowerId: data.userId,
      status: data.status,
      isCancelled: data.isCancelled,
      requestDate: data.requestDate,
      updatedAt: data.updatedAt,
    };
  });

  return flattenResult;
};
