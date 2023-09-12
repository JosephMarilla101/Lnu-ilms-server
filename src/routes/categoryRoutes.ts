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
import statusVerifier from '../middlewares/statusVerifier';

const categoryRouter = express.Router();

categoryRouter.use(jwtVerifier);
categoryRouter.use(statusVerifier);

categoryRouter.get('/', getCategory);
categoryRouter.post('/', createCategory);
categoryRouter.put('/', updateCategory);
categoryRouter.put('/soft-delete', deleteCategory);
categoryRouter.get('/all', getALLCategories);
categoryRouter.get('/active', getActiveCategories);

export default categoryRouter;
