import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import { adminLogin, authenticateUser } from '../controllers/authController';

const authRouter = express.Router();

authRouter.get('/', jwtVerifier, authenticateUser);
authRouter.post('/login/admin', adminLogin);

export default authRouter;
