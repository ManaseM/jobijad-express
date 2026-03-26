const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID },
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Anonymous' },
    email: { type: DataTypes.STRING },
    rating: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5, validate: { min: 1, max: 5 } },
    subject: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT, allowNull: false },
    adminReply: { type: DataTypes.TEXT },
    repliedAt: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('pending', 'replied'), defaultValue: 'pending' }
}, { tableName: 'feedbacks', timestamps: true });

module.exports = Feedback;
