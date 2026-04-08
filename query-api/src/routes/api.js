import express from 'express';
import { searchProducts } from '../controllers/searchController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Sesuai PDF: GET /api/search [cite: 62]
router.get('/search', authMiddleware, searchProducts);

export default router;