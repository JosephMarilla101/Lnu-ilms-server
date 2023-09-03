import { PrismaClient, Author } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

export const createAuthor = async (name: string): Promise<Author> => {
  const author = await prisma.author.create({
    data: {
      name,
    },
  });

  return author;
};

export const getALLAuthors = async (): Promise<Author[]> => {
  const authors = await prisma.author.findMany();

  return authors;
};
