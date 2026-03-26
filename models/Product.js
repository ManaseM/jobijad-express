const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.ENUM('women', 'men', 'accessories', 'children'), allowNull: false },
    images: { type: DataTypes.JSONB, defaultValue: [] },
    sizes: { type: DataTypes.JSONB, defaultValue: [] },
    colors: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    fabric: { type: DataTypes.STRING },
    care: { type: DataTypes.STRING },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    ratingAverage: { type: DataTypes.FLOAT, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'products', timestamps: true });

module.exports = Product;
