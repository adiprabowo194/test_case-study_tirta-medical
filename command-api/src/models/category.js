import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: () => uuidv4()
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.BIGINT,
        defaultValue: () => Date.now()
    }
}, {
    timestamps: false
});

export default Category;
