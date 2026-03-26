const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    orderNumber: { type: DataTypes.STRING, unique: true },
    items: { type: DataTypes.JSONB, defaultValue: [] },
    shippingAddress: { type: DataTypes.JSONB, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer', 'mobile_money'), allowNull: false },
    paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
    momoNumber: { type: DataTypes.STRING },
    momoNetwork: { type: DataTypes.STRING },
    paypalEmail: { type: DataTypes.STRING },
    paypalCardName: { type: DataTypes.STRING },
    paypalCardLast4: { type: DataTypes.STRING },
    paypalCardExpiry: { type: DataTypes.STRING },
    cardName: { type: DataTypes.STRING },
    cardLast4: { type: DataTypes.STRING },
    cardExpiry: { type: DataTypes.STRING },
    orderStatus: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    shippingCost: { type: DataTypes.FLOAT, defaultValue: 0 },
    tax: { type: DataTypes.FLOAT, defaultValue: 0 },
    total: { type: DataTypes.FLOAT, allowNull: false },
    notes: { type: DataTypes.TEXT },
    trackingNumber: { type: DataTypes.STRING },
    shippingDate: { type: DataTypes.DATEONLY },
    estimatedDelivery: { type: DataTypes.DATEONLY },
    deliveryNote: { type: DataTypes.TEXT }
}, { tableName: 'orders', timestamps: true });

Order.beforeCreate(async (order) => {
    const count = await Order.count();
    order.orderNumber = `JB${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
});

module.exports = Order;
