import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  await adminSeeder();
  await authorSeeder();
  await categorySeeder();
  await borrowedBookFeeSeeder();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function adminSeeder() {
  const adminEmail = 'admin@gmail.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const hashPassword = bcrypt.hashSync(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
      status: true,
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
      status: true,
    },
  });

  console.log('Admin table seeded successfully');
}

async function authorSeeder() {
  await prisma.author.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'J.K Rowling',
    },
    create: {
      name: 'J.K Rowling',
    },
  });

  await prisma.author.upsert({
    where: {
      id: 2,
    },
    update: {
      name: 'R.R Martin',
    },
    create: {
      name: 'R.R Martin',
    },
  });

  console.log('Author table seeded successfully');
}

async function categorySeeder() {
  await prisma.category.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'Fantasy',
      status: true,
    },
    create: {
      name: 'Fantasy',
      status: true,
    },
  });

  await prisma.category.upsert({
    where: {
      id: 2,
    },
    update: {
      name: 'Action',
      status: true,
    },
    create: {
      name: 'Action',
      status: true,
    },
  });

  console.log('Category table seeded successfully');
}

async function borrowedBookFeeSeeder() {
  await prisma.borrowedBookFee.upsert({
    where: {
      id: 1,
    },
    update: {
      initialFee: 80,
      followingDateFee: 8,
    },
    create: {
      initialFee: 80,
      followingDateFee: 8,
    },
  });

  console.log('Borrowed Book Fee table seeded successfully');
}
