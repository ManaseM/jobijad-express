const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendAdminSignupAlert } = require('../utils/mailer');

const router = express.Router();

router.post('/register', [
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password });
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Notify admin of new signup (non-blocking)
        sendAdminSignupAlert(user.toSafeJSON()).catch(() => {});

        res.status(201).json({ message: 'Registered successfully', token, user: user.toSafeJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, user: user.toSafeJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: user.toSafeJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
