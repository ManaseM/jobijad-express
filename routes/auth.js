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

// Logout — clears any server-side session tracking
router.post('/logout', auth, async (req, res) => {
    try {
        // Log the logout event
        console.log(`[AUTH] User ${req.user.userId} logged out at ${new Date().toISOString()}`);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot password — generates new password and sends via email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ where: { email: email.toLowerCase().trim(), isActive: true } });
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

        // Generate a new random password
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
        let newPassword = '';
        for (let i = 0; i < 10; i++) newPassword += chars[Math.floor(Math.random() * chars.length)];

        // Update user password — explicitly hash since beforeUpdate hook needs changed() to fire
        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashed });

        // Send email with new password
        const { sendMail } = require('../utils/mailer');
        await sendMail(user.email, 'Jobijad Express — Your New Password', `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
                <div style="background:#1a1a2e;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
                    <h2 style="color:#fff;margin:0;">Jobijad <span style="color:#f97316">Express</span></h2>
                </div>
                <div style="background:#fff;padding:24px;border:1px solid #e0e0e0;border-radius:0 0 8px 8px;">
                    <h3 style="color:#1a1a2e;">Password Reset</h3>
                    <p>Hi ${user.name},</p>
                    <p>Your password has been reset. Here is your new temporary password:</p>
                    <div style="background:#f4f6f8;border:2px solid #f97316;border-radius:8px;padding:16px;text-align:center;margin:16px 0;">
                        <span style="font-size:22px;font-weight:700;color:#1a1a2e;letter-spacing:2px;">${newPassword}</span>
                    </div>
                    <p style="color:#666;font-size:13px;">Please log in with this password and change it immediately from your account settings.</p>
                    <a href="${process.env.FRONTEND_URL || ''}/login.html" style="display:inline-block;background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px;">Login Now</a>
                    <p style="color:#aaa;font-size:11px;margin-top:20px;">If you didn't request this, contact us immediately at ${process.env.ADMIN_EMAIL || 'alitajudith2002@gmail.com'}</p>
                </div>
            </div>
        `);

        res.json({ message: 'A new password has been sent to your email.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Could not send reset email. Please try again.' });
    }
});

module.exports = router;
