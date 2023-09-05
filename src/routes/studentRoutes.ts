import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import { studentRegistration } from '../controllers/studentController';

const studentRouter = express.Router();

studentRouter.post('/register', studentRegistration);

export default studentRouter;
