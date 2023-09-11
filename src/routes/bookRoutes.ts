import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createBook,
  getBook,
  getBookList,
  requestBook,
  cancelRequest,
  createBorrowedBook,
  getRequestedBook,
  getALLRequestedBooks,
  getAllIssuedBooks,
  getBookLateFee,
  getUnreturnedBook,
  returnBorrowedBook,
  deleteBorrowedBook,
} from '../controllers/bookController';

const bookRouter = express.Router();

bookRouter.get('/', jwtVerifier, getBook);
bookRouter.get('/requested/all', jwtVerifier, getALLRequestedBooks);
bookRouter.get('/requested', jwtVerifier, getRequestedBook);
bookRouter.get('/unreturned', jwtVerifier, getUnreturnedBook);
bookRouter.get('/issued/all', jwtVerifier, getAllIssuedBooks);
bookRouter.get('/list', jwtVerifier, getBookList);
bookRouter.get('/late_fee', jwtVerifier, getBookLateFee);
bookRouter.post('/', jwtVerifier, createBook);
bookRouter.post('/request', jwtVerifier, requestBook);
bookRouter.post('/borrow_book', jwtVerifier, createBorrowedBook);
bookRouter.put('/borrowed/return', jwtVerifier, returnBorrowedBook);
bookRouter.delete('/cancel_request', jwtVerifier, cancelRequest);
bookRouter.delete('/issued_book', jwtVerifier, deleteBorrowedBook);

export default bookRouter;
