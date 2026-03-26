const express = require('express');
const Inquiry = require('../models/Inquiry');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Customer submits inquiry (no auth required)
router.post('/', async (req, res) => {
    try {
        const { name, email, productName, quantity, message, userId } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: 'Name, email and message are required' });
        const inquiry = await Inquiry.create({ name, email, productName, quantity: quantity || 1, message, userId: userId || null });
        res.status(201).json({ message: 'Inquiry submitted', inquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: get all inquiries
router.get('/', adminAuth, async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ inquiries });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: reply to inquiry
router.put('/:id/reply', adminAuth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByPk(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        await inquiry.update({ adminReply: req.body.reply, status: 'replied', repliedAt: new Date() });
        res.json({ message: 'Reply sent', inquiry });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Customer: get their own inquiries by email
router.get('/my/:email', async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            where: { email: req.params.email },
            order: [['createdAt', 'DESC']]
        });
        res.json({ inquiries });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
