import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import { createAuthor, getALLAuthors } from '../controllers/authorController';

const authorRouter = express.Router();

authorRouter.get('/all', jwtVerifier, getALLAuthors);
authorRouter.post('/', jwtVerifier, createAuthor);

export default authorRouter;
