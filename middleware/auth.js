const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory failed attempt tracker (resets on server restart)
const failedAttempts = new Map();
const BLOCK_THRESHOLD = 10;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 min

function trackFailedAttempt(ip) {
    const now = Date.now();
    const record = failedAttempts.get(ip) || { count: 0, firstAttempt: now };
    if (now - record.firstAttempt > BLOCK_DURATION) {
        failedAttempts.set(ip, { count: 1, firstAttempt: now });
    } else {
        record.count++;
        failedAttempts.set(ip, record);
    }
}

function isBlocked(ip) {
    const record = failedAttempts.get(ip);
    if (!record) return false;
    if (Date.now() - record.firstAttempt > BLOCK_DURATION) { failedAttempts.delete(ip); return false; }
    return record.count >= BLOCK_THRESHOLD;
}

function clearAttempts(ip) { failedAttempts.delete(ip); }

const auth = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        if (isBlocked(ip)) return res.status(429).json({ message: 'Too many failed attempts. Try again later.' });

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) { trackFailedAttempt(ip); return res.status(401).json({ message: 'No token provided' }); }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) { trackFailedAttempt(ip); return res.status(401).json({ message: 'Token invalid' }); }

        clearAttempts(ip);
        req.user = { ...decoded, role: user.role }; // always use DB role, not token role
        next();
    } catch (err) {
        const ip = req.ip || req.connection.remoteAddress;
        trackFailedAttempt(ip);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        if (isBlocked(ip)) return res.status(429).json({ message: 'Too many failed attempts. Try again later.' });

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) { trackFailedAttempt(ip); return res.status(401).json({ message: 'No token provided' }); }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) { trackFailedAttempt(ip); return res.status(401).json({ message: 'Token invalid' }); }

        // Always verify role from DB — never trust token role alone
        if (user.role !== 'admin') {
            trackFailedAttempt(ip);
            // Log unauthorized admin access attempt
            console.warn(`[SECURITY] Unauthorized admin access attempt by user ${user.email} from IP ${ip} at ${new Date().toISOString()}`);
            return res.status(403).json({ message: 'Admin access required' });
        }

        clearAttempts(ip);
        req.user = { ...decoded, role: 'admin' };
        next();
    } catch (err) {
        const ip = req.ip || req.connection.remoteAddress;
        trackFailedAttempt(ip);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = { auth, adminAuth };
