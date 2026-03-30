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

// Forgot password — sends reset link via email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        // Always return success to prevent email enumeration
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

        // Generate reset token (valid 1 hour)
        const resetToken = jwt.sign(
            { userId: user.id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetUrl = `${process.env.FRONTEND_URL || ''}/reset-password.html?token=${resetToken}`;

        // Send email
        const { sendMail } = require('../utils/mailer');
        await sendMail({
            to: user.email,
            subject: 'Jobijad Express — Password Reset',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
                    <h2 style="color:#1a1a2e;">Password Reset Request</h2>
                    <p>Hi ${user.name},</p>
                    <p>Click the button below to reset your password. This link expires in 1 hour.</p>
                    <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0;">Reset Password</a>
                    <p style="color:#888;font-size:12px;">If you didn't request this, ignore this email.</p>
                    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                    <p style="color:#aaa;font-size:11px;">Jobijad Express — Premium African Fashion</p>
                </div>
            `
        });

        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Could not send reset email. Please try again.' });
    }
});

module.exports = router;
