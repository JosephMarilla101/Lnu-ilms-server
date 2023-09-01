import express from 'express';
import { login as adminLogin } from '../controllers/adminController';

const authRouter = express.Router();

authRouter.post('/login/admin', adminLogin);

export default authRouter;
