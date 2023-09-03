import { PrismaClient, Author } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

// When fetchin author, exclude the softdeleted author by adding isDeleted = false in where clause

export const createAuthor = async (name: string): Promise<Author> => {
  const author = await prisma.author.create({
    data: {
      name,
    },
  });

  return author;
};

export const updateAuthor = async ({
  id,
  name,
  status,
}: {
  id: number;
  name: string;
  status: boolean;
}) => {
  const author = await prisma.author.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedAuthor = await prisma.author.update({
    where: {
      id,
    },
    data: {
      name,
      status,
    },
  });

  return updatedAuthor;
};

export const deleteAuthor = async (id: number): Promise<Author> => {
  const author = await prisma.author.findUnique({
    where: {
      id,
    },
  });

  if (!author) throw new customeError(404, 'Author not found');

  const deletedAuthor = await prisma.author.update({
    where: {
      id: author.id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedAuthor;
};

export const getAuthor = async (id: number): Promise<Author> => {
  const author = await prisma.author.findUnique({
    where: {
      id,
    },
  });

  if (!author) throw new customeError(404, 'Author not found');

  return author;
};

export const getALLAuthors = async (): Promise<Author[]> => {
  const authors = await prisma.author.findMany({
    where: {
      isDeleted: false,
    },
  });

  return authors;
};
