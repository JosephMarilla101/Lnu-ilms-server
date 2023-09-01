import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const adminEmail = 'admin@gmail.com';
const adminUsername = 'admin';
const adminPassword = 'admin123';

async function main() {
  const hashPassword = bcrypt.hashSync(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashPassword,
    },
  });
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
