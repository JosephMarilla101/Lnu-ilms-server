import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  adminLogin,
  librarianLogin,
  studentLogin,
  authenticateUser,
} from '../controllers/authController';
import statusVerifier from '../middlewares/statusVerifier';

const authRouter = express.Router();

authRouter.post('/login/admin', adminLogin);
authRouter.post('/login/librarian', librarianLogin);
authRouter.post('/login/student', studentLogin);

authRouter.use(jwtVerifier);
authRouter.use(statusVerifier);
authRouter.get('/', authenticateUser);

export default authRouter;
