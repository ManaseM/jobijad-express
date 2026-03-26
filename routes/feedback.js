const express = require('express');
const Feedback = require('../models/Feedback');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Anyone can submit feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, rating, subject, message, comment, userId } = req.body;
        const text = message || comment || '';
        if (!text.trim()) return res.status(400).json({ message: 'Please write something — anything!' });
        const fb = await Feedback.create({
            name: (name && name.trim()) || 'Anonymous',
            email: email || null,
            rating: (rating && rating >= 1 && rating <= 5) ? parseInt(rating) : 5,
            subject: subject || null,
            message: text.trim(),
            userId: userId || null
        });
        res.status(201).json({ message: 'Feedback submitted', feedback: fb });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Public: get all approved/replied feedbacks for display on store
router.get('/public', async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']], limit: 20 });
        res.json({ feedbacks });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: get all feedbacks
router.get('/', adminAuth, async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ feedbacks });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: reply to feedback
router.put('/:id/reply', adminAuth, async (req, res) => {
    try {
        const fb = await Feedback.findByPk(req.params.id);
        if (!fb) return res.status(404).json({ message: 'Feedback not found' });
        await fb.update({ adminReply: req.body.reply, status: 'replied', repliedAt: new Date() });
        res.json({ message: 'Reply sent', feedback: fb });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
