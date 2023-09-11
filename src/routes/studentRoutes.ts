import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  studentRegistration,
  updateProfile,
  changePassword,
} from '../controllers/studentController';

const studentRouter = express.Router();

studentRouter.post('/register', studentRegistration);
studentRouter.put('/', jwtVerifier, updateProfile);
studentRouter.put('/change_password', jwtVerifier, changePassword);

export default studentRouter;
