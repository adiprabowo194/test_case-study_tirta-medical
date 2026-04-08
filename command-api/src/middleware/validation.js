import { body, validationResult } from 'express-validator';

// Fungsi helper untuk menangani error validasi
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            // .mapped() memberikan format objek sesuai spesifikasi
            errors: errors.mapped()
        });
    }
    next();
};

// Validasi Create Category
export const validateCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('name is empty')
        .isLength({ max: 255 }).withMessage('name length must not more than 255 characters'),
    validate
];

// Validasi Create Product
export const validateProduct = [
    body('sku')
        .trim()
        .notEmpty().withMessage('sku is empty'),
    body('name')
        .trim()
        .notEmpty().withMessage('name is empty')
        .isLength({ max: 255 }).withMessage('name length must not more than 255 characters'),
    body('price')
        .notEmpty().withMessage('price is empty')
        .isFloat({ min: 0 }).withMessage('price must not negative'),
    body('stock')
        .notEmpty().withMessage('stock is empty')
        .isInt({ min: 0 }).withMessage('stock must not negative'),
    body('categoryId')
        .trim()
        .notEmpty().withMessage('categoryId is empty'),
    validate
];