import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  librarianRegistration,
  getAllLibrarians,
  suspendLibrarian,
  unsuspendLibrarian,
  changePassword,
  updateProfile,
  updateProfilePhoto,
} from '../controllers/librarianController';
import statusVerifier from '../middlewares/statusVerifier';

const librarianRouter = express.Router();

librarianRouter.post('/register', librarianRegistration);

librarianRouter.use(jwtVerifier);
librarianRouter.use(statusVerifier);

librarianRouter.get('/all', getAllLibrarians);
librarianRouter.post('/suspend', suspendLibrarian);
librarianRouter.post('/unsuspend', unsuspendLibrarian);
librarianRouter.put('/', updateProfile);
librarianRouter.put('/profile_photo', updateProfilePhoto);
librarianRouter.put('/change_password', changePassword);

export default librarianRouter;
