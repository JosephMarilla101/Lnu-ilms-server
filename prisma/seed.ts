import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  await deleteAllBorrowRequests();
  // await adminSeeder();
  // await authorSeeder();
  // await categorySeeder();
  // await borrowedBookFeeSeeder();
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

async function deleteAllBorrowRequests() {
  try {
    await prisma.borrowRequest.deleteMany({});
    console.log('All records deleted from BorrowRequest table.');
  } catch (error) {
    console.error('Error deleting records:', error);
  }
};  

async function adminSeeder() {
  const adminEmail = 'admin@gmail.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const hashPassword = bcrypt.hashSync(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
      role: 'ADMIN',
      status: true,
      profile: {
        update: {
          id: 1,
          fullname: 'ADMINISTRATOR',
        },
      },
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
      role: 'ADMIN',
      status: true,
      profile: {
        create: {
          id: 1,
          fullname: 'ADMINISTRATOR',
        },
      },
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
      initialFee: 8,
      followingDateFee: 8,
    },
    create: {
      initialFee: 8,
      followingDateFee: 8,
    },
  });

  console.log('Borrowed Book Fee table seeded successfully');
}
