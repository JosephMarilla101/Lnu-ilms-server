import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createAuthor,
  deleteAuthor,
  getAuthor,
  updateAuthor,
  getALLAuthors,
  getActiveAuthors,
} from '../controllers/authorController';
import statusVerifier from '../middlewares/statusVerifier';

const authorRouter = express.Router();

authorRouter.use(jwtVerifier);
authorRouter.use(statusVerifier);

authorRouter.get('/', getAuthor);
authorRouter.post('/', createAuthor);
authorRouter.put('/', updateAuthor);
authorRouter.put('/soft-delete', deleteAuthor);
authorRouter.get('/all', getALLAuthors);
authorRouter.get('/active', getActiveAuthors);

export default authorRouter;
