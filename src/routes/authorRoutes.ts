import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createAuthor,
  deleteAuthor,
  getAuthor,
  getALLAuthors,
  updateAuthor,
} from '../controllers/authorController';

const authorRouter = express.Router();

authorRouter.get('/', jwtVerifier, getAuthor);
authorRouter.post('/', jwtVerifier, createAuthor);
authorRouter.put('/', jwtVerifier, updateAuthor);
authorRouter.put('/soft-delete', jwtVerifier, deleteAuthor);
authorRouter.get('/all', jwtVerifier, getALLAuthors);

export default authorRouter;
