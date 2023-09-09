import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createBook,
  getBook,
  getBookList,
  requestBook,
  cancelRequest,
  getRequestedBook,
  getALLRequestedBooks,
  createBorrowedBook,
} from '../controllers/bookController';

const bookRouter = express.Router();

bookRouter.get('/', jwtVerifier, getBook);
bookRouter.get('/requested/all', jwtVerifier, getALLRequestedBooks);
bookRouter.get('/requested', jwtVerifier, getRequestedBook);
bookRouter.get('/list', jwtVerifier, getBookList);
bookRouter.post('/', jwtVerifier, createBook);
bookRouter.post('/request', jwtVerifier, requestBook);
bookRouter.post('/cancel_request', jwtVerifier, cancelRequest);
bookRouter.post('/borrow_book', jwtVerifier, createBorrowedBook);

export default bookRouter;
