require('dotenv').config();
import express from 'express';
import cors from 'cors';
import corsOption from './src/config/cors';
import authRoutes from './src/routes/authRoutes';
import authorRoutes from './src/routes/authorRoutes';
import categoryRoutes from './src/routes/categoryRoutes';
import bookRoutes from './src/routes/bookRoutes';
import { PrismaClient } from '@prisma/client';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOption));
app.use(express.json());

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
});

// api routes
app.all('/api', (req, res) => {
  res.status(200).send('Welcome to LNU-ILMS api');
});

app.use('/api/auth', authRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/book', bookRoutes);

app.all('*', (req, res) => {
  res.status(404).send('ROUTE NOT FOUND');
});
