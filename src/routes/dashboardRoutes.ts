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

const dashboardRouter = express.Router();

dashboardRouter.get('/total_books', jwtVerifier, totalBooks);
dashboardRouter.get('/total_requested_books', jwtVerifier, totalRequestedBooks);
dashboardRouter.get('/total_borrowed_books', jwtVerifier, totalBorrowedBooks);
dashboardRouter.get('/total_authors', jwtVerifier, totalAuthors);
dashboardRouter.get('/total_catoegories', jwtVerifier, totalCatoegories);
dashboardRouter.get('/total_students', jwtVerifier, totalStudents);
dashboardRouter.get('/total_librarians', jwtVerifier, totalLibrarians);
dashboardRouter.get(
  '/total_unreturned_books',
  jwtVerifier,
  totalUnreturnedBooks
);

export default dashboardRouter;
