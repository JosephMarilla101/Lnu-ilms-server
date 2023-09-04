import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createBook,
  getBook,
  getBookList,
} from '../controllers/bookController';

const bookRouter = express.Router();

bookRouter.get('/', jwtVerifier, getBook);
bookRouter.get('/list', jwtVerifier, getBookList);
bookRouter.post('/', jwtVerifier, createBook);

export default bookRouter;
