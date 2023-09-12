import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  totalBooks,
  totalUnreturnedBooks,
  totalRequestedBooks,
  totalBorrowedBooks,
  totalAuthors,
  totalCatoegories,
  totalStudents,
  totalLibrarians,
} from '../controllers/dashboardController';
import statusVerifier from '../middlewares/statusVerifier';

const dashboardRouter = express.Router();

dashboardRouter.use(jwtVerifier);
dashboardRouter.use(statusVerifier);

dashboardRouter.get('/total_books', totalBooks);
dashboardRouter.get('/total_requested_books', totalRequestedBooks);
dashboardRouter.get('/total_borrowed_books', totalBorrowedBooks);
dashboardRouter.get('/total_authors', totalAuthors);
dashboardRouter.get('/total_catoegories', totalCatoegories);
dashboardRouter.get('/total_students', totalStudents);
dashboardRouter.get('/total_librarians', totalLibrarians);
dashboardRouter.get('/total_unreturned_books', totalUnreturnedBooks);

export default dashboardRouter;
