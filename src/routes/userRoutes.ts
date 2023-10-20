import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  studentRegistration,
  graduateRegistration,
  teacherRegistration,
  updateProfile,
  changePassword,
  getAllStudents,
  suspendStudent,
  unsuspendStudent,
  updateProfilePhoto,
  getStudentBorrowedBooks,
} from '../controllers/userController';
import statusVerifier from '../middlewares/statusVerifier';

const studentRouter = express.Router();

studentRouter.post('/register/student', studentRegistration);
studentRouter.post('/register/graduate', graduateRegistration);
studentRouter.post('/register/teacher', teacherRegistration);

studentRouter.use(jwtVerifier);
studentRouter.use(statusVerifier);

studentRouter.get('/all', getAllStudents);
studentRouter.get('/borrowed_books/:id', getStudentBorrowedBooks);
studentRouter.post('/suspend', suspendStudent);
studentRouter.post('/unsuspend', unsuspendStudent);
studentRouter.put('/', updateProfile);
studentRouter.put('/profile_photo', updateProfilePhoto);
studentRouter.put('/change_password', changePassword);

export default studentRouter;
