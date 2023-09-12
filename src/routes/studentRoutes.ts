import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  studentRegistration,
  updateProfile,
  changePassword,
  getAllStudents,
  suspendStudent,
  unsuspendStudent,
} from '../controllers/studentController';
import statusVerifier from '../middlewares/statusVerifier';

const studentRouter = express.Router();

studentRouter.post('/register', studentRegistration);

studentRouter.use(jwtVerifier);
studentRouter.use(statusVerifier);

studentRouter.get('/all', getAllStudents);
studentRouter.post('/suspend', suspendStudent);
studentRouter.post('/unsuspend', unsuspendStudent);
studentRouter.put('/', updateProfile);
studentRouter.put('/change_password', changePassword);

export default studentRouter;
