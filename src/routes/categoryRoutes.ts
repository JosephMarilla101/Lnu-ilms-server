import express from 'express';
import jwtVerifier from '../middlewares/jwtVerifier';
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
  getALLCategories,
  getActiveCategories,
} from '../controllers/categoryController';

const categoryRouter = express.Router();

categoryRouter.get('/', jwtVerifier, getCategory);
categoryRouter.post('/', jwtVerifier, createCategory);
categoryRouter.put('/', jwtVerifier, updateCategory);
categoryRouter.put('/soft-delete', jwtVerifier, deleteCategory);
categoryRouter.get('/all', jwtVerifier, getALLCategories);
categoryRouter.get('/active', jwtVerifier, getActiveCategories);

export default categoryRouter;
