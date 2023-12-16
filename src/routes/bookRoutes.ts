import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import statusVerifier from '../middlewares/statusVerifier';
import {
  createBook,
  getBook,
  getBookList,
  requestBook,
  changeRequestStatus,
  releaseBook,
  getRequestedBook,
  getALLRequestedBooks,
  getAllIssuedBooks,
  getBookLateFee,
  getUnreturnedBook,
  returnBorrowedBook,
  deleteBorrowedBook,
  updateBook,
  deleteBook,
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
bookRouter.put('/', updateBook);
bookRouter.put('/change_request_status', changeRequestStatus);
bookRouter.post('/request', requestBook);
bookRouter.post('/release_book', releaseBook);
bookRouter.put('/borrowed/return', returnBorrowedBook);
bookRouter.delete('/', deleteBook);
bookRouter.delete('/issued_book', deleteBorrowedBook);

export default bookRouter;
