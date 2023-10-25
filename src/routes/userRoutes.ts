import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  studentRegistration,
  graduateRegistration,
  teacherRegistration,
  librarianRegistration,
  updateProfile,
  changePassword,
  getAllStudents,
  getAllLibrarians,
  suspendStudent,
  unsuspendStudent,
  updateProfilePhoto,
  getStudentBorrowedBooks,
} from '../controllers/userController';
import statusVerifier from '../middlewares/statusVerifier';

const userRouter = express.Router();

userRouter.post('/register/student', studentRegistration);
userRouter.post('/register/graduate', graduateRegistration);
userRouter.post('/register/teacher', teacherRegistration);
userRouter.post('/register/librarian', librarianRegistration);

userRouter.use(jwtVerifier);
userRouter.use(statusVerifier);

userRouter.get('/all_students', getAllStudents);
userRouter.get('/all_librarians', getAllLibrarians);
userRouter.get('/borrowed_books/:id', getStudentBorrowedBooks);
userRouter.post('/suspend', suspendStudent);
userRouter.post('/unsuspend', unsuspendStudent);
userRouter.put('/', updateProfile);
userRouter.put('/profile_photo', updateProfilePhoto);
userRouter.put('/change_password', changePassword);

export default userRouter;
