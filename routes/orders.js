const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendOrderConfirmation, sendAdminOrderAlert } = require('../utils/mailer');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, subtotal, shippingCost, tax, total, notes, momoNumber, momoNetwork, paypalCardName, paypalCardLast4, paypalCardExpiry, cardName, cardLast4, cardExpiry } = req.body;

        if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });
        if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city)
            return res.status(400).json({ message: 'Shipping address incomplete' });

        const order = await Order.create({
            userId: req.user.userId,
            items,
            shippingAddress,
            paymentMethod: paymentMethod || 'bank_transfer',
            momoNumber: momoNumber || null,
            momoNetwork: momoNetwork || null,
            paypalEmail: null,
            paypalCardName: paypalCardName || null,
            paypalCardLast4: paypalCardLast4 || null,
            paypalCardExpiry: paypalCardExpiry || null,
            cardName: cardName || null,
            cardLast4: cardLast4 || null,
            cardExpiry: cardExpiry || null,
            subtotal: subtotal || 0,
            shippingCost: shippingCost || 0,
            tax: tax || 0,
            total: total || 0,
            notes
        });

        // Send confirmation emails (non-blocking)
        try {
            const user = await User.findByPk(req.user.userId);
            if (user) {
                sendOrderConfirmation(user.email, user.name, order).catch(() => {});
                sendAdminOrderAlert(order, user.name).catch(() => {});
            }
        } catch(_) {}

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Both /my and /my-orders work
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        // allow admin or the order owner
        const isAdmin = req.user.role === 'admin';
        if (!isAdmin && order.userId !== req.user.userId) return res.status(403).json({ message: 'Access denied' });
        res.json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id/status', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await order.update({ orderStatus: req.body.orderStatus, trackingNumber: req.body.trackingNumber });
        res.json({ message: 'Status updated', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: approve payment (marks paymentStatus=paid, orderStatus=confirmed) + set delivery schedule
router.put('/:id/approve-payment', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const { shippingDate, estimatedDelivery, deliveryNote, trackingNumber } = req.body;
        await order.update({
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            shippingDate: shippingDate || null,
            estimatedDelivery: estimatedDelivery || null,
            deliveryNote: deliveryNote || null,
            trackingNumber: trackingNumber || order.trackingNumber
        });
        res.json({ message: 'Payment approved', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', adminAuth, async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
