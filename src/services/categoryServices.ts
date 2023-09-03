import { PrismaClient, Category } from '@prisma/client';
import customeError from '../utils/customError';

const prisma = new PrismaClient();

// When fetchin category, exclude the softdeleted category by adding isDeleted = false in where clause

export const createCategory = async ({
  name,
  status,
}: {
  name: string;
  status: boolean;
}): Promise<Category> => {
  const category = await prisma.category.create({
    data: {
      name,
      status,
    },
  });

  return category;
};

export const updateCategory = async ({
  id,
  name,
  status,
}: {
  id: number;
  name: string;
  status: boolean;
}) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      status,
    },
  });

  return updatedCategory;
};

export const deleteCategory = async (id: number): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) throw new customeError(404, 'Category not found');

  const deletedCategory = await prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedCategory;
};

export const getCategory = async (id: number): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) throw new customeError(404, 'Category not found');

  return category;
};

export const getALLCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });

  return categories;
};
