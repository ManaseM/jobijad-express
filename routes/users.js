const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', adminAuth, async (req, res) => {
    try {
        const users = await User.findAll({ where: { isActive: true }, attributes: { exclude: ['password'] } });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Customer: update own profile (name + email + avatar)
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
        const user = await User.findByPk(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (email !== user.email) {
            const existing = await User.findOne({ where: { email } });
            if (existing) return res.status(400).json({ message: 'Email already in use by another account' });
        }
        const updates = { name: name.trim(), email: email.trim().toLowerCase() };
        if (avatar !== undefined) updates.avatar = avatar; // null clears it
        await user.update(updates);
        const updated = user.toJSON();
        delete updated.password;
        res.json({ message: 'Profile updated', user: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.update({ isActive: false });
        res.json({ message: 'User deactivated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
