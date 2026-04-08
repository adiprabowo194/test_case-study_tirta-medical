import sequelize from '../config/database.js';
import Category from './category.js';
import Product from './product.js';

// Relasi
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export {
    sequelize,
    Category,
    Product
};