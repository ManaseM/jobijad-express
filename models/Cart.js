const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, unique: true },
    items: { type: DataTypes.JSONB, defaultValue: [] },
    total: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName: 'carts', timestamps: true });

module.exports = Cart;
