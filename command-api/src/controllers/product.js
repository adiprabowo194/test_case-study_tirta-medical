import { Product, Category } from '../models/index.js';
import { publishToQueue } from '../utils/rabbitmq.js';

export const create = async (req, res) => {
    try {
        const { sku, name, price, stock, categoryId } = req.body;

        // 1. Cek SKU sudah digunakan (Unique)
        const existingProduct = await Product.findOne({ where: { sku } });
        if (existingProduct) {
            return res.status(400).json({
                errors: {
                    sku: ["sku is unique"]
                }
            });
        }

        // 2. Cek Category ID valid/ada
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({
                errors: {
                    categoryId: ["category not found"]
                }
            });
        }

        // 3. Simpan Product
        const product = await Product.create({
            sku,
            name,
            price,
            stock,
            categoryId
        });

        // KIRIM DATA KE RABBITMQ (Sinkronisasi ke Query-API)
        await publishToQueue('product_created', {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        });

        // 4. Response
        return res.status(201).json({
            data: {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: Number(product.price),
                stock: Number(product.stock),
                category: {
                    id: category.id,
                    name: category.name,
                    createdAt: Number(category.createdAt)
                }
            }
        });
    } catch (error) {
        console.error("Error at Create Product:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};