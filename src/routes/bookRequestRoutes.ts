import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import statusVerifier from '../middlewares/statusVerifier';
import { getALLRequestedBooks } from '../controllers/bookRequestController';

const bookRouter = express.Router();

bookRouter.use(jwtVerifier);
bookRouter.use(statusVerifier);

bookRouter.get('/all', getALLRequestedBooks);

export default bookRouter;
