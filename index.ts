require('dotenv').config();
import express from 'express';
import cors from 'cors';
import corsOption from './src/config/cors';
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import authorRoutes from './src/routes/authorRoutes';
import categoryRoutes from './src/routes/categoryRoutes';
import bookRoutes from './src/routes/bookRoutes';
import dashboardRoutes from './src/routes/dashboardRoutes';
import { PrismaClient } from '@prisma/client';

const PORT: number = parseInt(process.env.PORT as string) || 5000;
/* 
To run server on local network, get the ipv4 address 
of your machine and change the LOCAL_IP env value 
*/
const NETWORK_ADDRESS = `${process.env.LOCAL_IP}:${PORT}`;

const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOption));
app.use(express.json());

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
  app.listen(PORT, '0.0.0.0', async () => {
    try {
      await prisma.$connect();
      console.log(`Server running on port ${PORT}`);
      console.log(`Server running on ${NETWORK_ADDRESS}`);
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      process.exit(1);
    }
  });
} else {
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
}

// api routes
app.all('/api', (req, res) => {
  res.status(200).send('Welcome to LNU-ILMS api');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.all('*', (req, res) => {
  res.status(404).send('ROUTE NOT FOUND');
});
