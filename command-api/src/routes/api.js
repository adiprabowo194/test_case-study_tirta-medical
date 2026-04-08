import express from 'express';
const router = express.Router();

import auth from '../middleware/auth.js';
import { validateCategory, validateProduct } from '../middleware/validation.js';
import * as categoryController from '../controllers/category.js';
import * as productController from '../controllers/product.js';

router.post('/categories', auth, validateCategory, categoryController.create);
router.post('/products', auth, validateProduct, productController.create);

export default router;