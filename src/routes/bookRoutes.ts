import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import statusVerifier from '../middlewares/statusVerifier';
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

bookRouter.use(jwtVerifier);
bookRouter.use(statusVerifier);

bookRouter.get('/', getBook);
bookRouter.get('/requested/all', getALLRequestedBooks);
bookRouter.get('/requested', getRequestedBook);
bookRouter.get('/unreturned', getUnreturnedBook);
bookRouter.get('/issued/all', getAllIssuedBooks);
bookRouter.get('/list', getBookList);
bookRouter.get('/late_fee', getBookLateFee);
bookRouter.post('/', createBook);
bookRouter.post('/request', requestBook);
bookRouter.post('/borrow_book', createBorrowedBook);
bookRouter.put('/borrowed/return', returnBorrowedBook);
bookRouter.delete('/cancel_request', cancelRequest);
bookRouter.delete('/issued_book', deleteBorrowedBook);

export default bookRouter;
