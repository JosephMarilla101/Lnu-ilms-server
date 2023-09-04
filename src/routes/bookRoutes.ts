import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import { createBook } from '../controllers/bookController';

const categoryRouter = express.Router();

categoryRouter.post('/', jwtVerifier, createBook);

export default categoryRouter;
