import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  adminLogin,
  librarianLogin,
  userLogin,
  authenticateUser,
} from '../controllers/authController';
import statusVerifier from '../middlewares/statusVerifier';

const authRouter = express.Router();

authRouter.post('/login/admin', adminLogin);
authRouter.post('/login/librarian', librarianLogin);
authRouter.post('/login/user', userLogin);

authRouter.use(jwtVerifier);
authRouter.use(statusVerifier);
authRouter.get('/', authenticateUser);

export default authRouter;
