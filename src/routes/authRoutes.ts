import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  adminLogin,
  studentLogin,
  authenticateUser,
} from '../controllers/authController';

const authRouter = express.Router();

authRouter.get('/', jwtVerifier, authenticateUser);
authRouter.post('/login/admin', adminLogin);
authRouter.post('/login/student', studentLogin);

export default authRouter;
