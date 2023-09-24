import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  changePassword,
  updateProfile,
  updateProfilePhoto,
} from '../controllers/adminController';
import statusVerifier from '../middlewares/statusVerifier';

const adminRouter = express.Router();

adminRouter.use(jwtVerifier);
adminRouter.use(statusVerifier);

adminRouter.put('/', updateProfile);
adminRouter.put('/profile_photo', updateProfilePhoto);
adminRouter.put('/change_password', changePassword);

export default adminRouter;
