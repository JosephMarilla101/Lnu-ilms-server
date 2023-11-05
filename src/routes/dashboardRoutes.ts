import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  topBookCategories,
  userBorrowCount,
  userCountData,
  totalBooks,
  totalUnreturnedBooks,
  myTotalUnreturnedBooks,
  totalRequestedBooks,
  myTotalRequestedBooks,
  totalBorrowedBooks,
  myTotalBorrowedBooks,
  totalAuthors,
  totalCatoegories,
  totalStudents,
  totalGraduates,
  totalTeachers,
  totalLibrarians,
} from '../controllers/dashboardController';
import statusVerifier from '../middlewares/statusVerifier';

const dashboardRouter = express.Router();

dashboardRouter.use(jwtVerifier);
dashboardRouter.use(statusVerifier);

dashboardRouter.get('/top_categories', topBookCategories);
dashboardRouter.get('/user_borrow_count', userBorrowCount);
dashboardRouter.get('/user_count_data', userCountData);
dashboardRouter.get('/total_books', totalBooks);
dashboardRouter.get('/total_requested_books', totalRequestedBooks);
dashboardRouter.get('/my_total_requested_books', myTotalRequestedBooks);
dashboardRouter.get('/total_borrowed_books', totalBorrowedBooks);
dashboardRouter.get('/my_total_borrowed_books', myTotalBorrowedBooks);
dashboardRouter.get('/total_authors', totalAuthors);
dashboardRouter.get('/total_catoegories', totalCatoegories);
dashboardRouter.get('/total_students', totalStudents);
dashboardRouter.get('/total_graduates', totalGraduates);
dashboardRouter.get('/total_teachers', totalTeachers);
dashboardRouter.get('/total_librarians', totalLibrarians);
dashboardRouter.get('/total_unreturned_books', totalUnreturnedBooks);
dashboardRouter.get('/my_total_unreturned_books', myTotalUnreturnedBooks);

export default dashboardRouter;
