const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inquiry = sequelize.define('Inquiry', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    productName: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('open', 'replied', 'closed'), defaultValue: 'open' },
    adminReply: { type: DataTypes.TEXT },
    repliedAt: { type: DataTypes.DATE },
    userId: { type: DataTypes.UUID }
}, { tableName: 'inquiries', timestamps: true });

module.exports = Inquiry;
