import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

export const searchProducts = async (req, res) => {
    try {
        const {
            sku, name,
            'price.start': priceStart, 'price.end': priceEnd,
            'stock.start': stockStart, 'stock.end': stockEnd,
            'category.id': catId, 'category.name': catName,
            page = 1, size = 10
        } = req.query;

        let whereProduct = {};
        let whereCategory = {};

        // Filter SKU - Mendukung multiple parameter [cite: 64, 74]
        if (sku) {
            whereProduct.sku = { [Op.in]: Array.isArray(sku) ? sku : [sku] };
        }

        // Filter Name - LIKE dan mendukung multiple parameter [cite: 64, 76]
        if (name) {
            const names = Array.isArray(name) ? name : [name];
            whereProduct.name = { [Op.or]: names.map(n => ({ [Op.like]: `%${n}%` })) };
        }

        // Filter Harga (Range) [cite: 66, 77]
        if (priceStart || priceEnd) {
            whereProduct.price = {};
            if (priceStart) whereProduct.price[Op.gte] = Number(priceStart);
            if (priceEnd) whereProduct.price[Op.lte] = Number(priceEnd);
        }

        // Filter Stok (Range) [cite: 67, 68]
        if (stockStart || stockEnd) {
            whereProduct.stock = {};
            if (stockStart) whereProduct.stock[Op.gte] = Number(stockStart);
            if (stockEnd) whereProduct.stock[Op.lte] = Number(stockEnd);
        }

        // Filter Category ID [cite: 69, 80]
        if (catId) {
            whereCategory.id = { [Op.in]: Array.isArray(catId) ? catId : [catId] };
        }

        // Filter Category Name [cite: 71]
        if (catName) {
            const catNames = Array.isArray(catName) ? catName : [catName];
            whereCategory.name = { [Op.or]: catNames.map(cn => ({ [Op.like]: `%${cn}%` })) };
        }

        const limit = parseInt(size);
        const offset = (parseInt(page) - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
            where: whereProduct,
            include: [{
                model: Category,
                as: 'category',
                where: Object.keys(whereCategory).length > 0 ? whereCategory : null,
                attributes: ['id', 'name']
            }],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        // Response sesuai spesifikasi Success Response [cite: 81, 82, 86, 98]
        res.status(200).json({
            data: rows.map(p => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                price: p.price,
                stock: p.stock,
                category: p.category,
                createdAt: Number(p.createdAt)
            })),
            paging: {
                size: limit,
                total: Math.ceil(count / limit),
                current: parseInt(page)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};