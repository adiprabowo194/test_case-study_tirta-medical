import { Category } from '../models/index.js';
import { publishToQueue } from '../utils/rabbitmq.js';

export const create = async (req, res) => {
    try {
        const { name } = req.body;

        // Cek jika kategori sudah ada (agar tidak double)
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({
                errors: {
                    name: ["category name already exists"]
                }
            });
        }

        const category = await Category.create({ name });
        // KIRIM KE RABBITMQ  
        await publishToQueue('category_created', {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        });

        return res.status(201).json({
            data: {
                id: category.id,
                name: category.name,
                createdAt: Number(category.createdAt)
            }
        });
    } catch (error) {
        console.error("Error at Create Category:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};