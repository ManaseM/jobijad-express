const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
// Import models so Sequelize registers them
require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/Cart');
require('./models/Inquiry');
require('./models/Feedback');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: function(origin, callback) {
        const allowed = [
            'http://localhost:3000',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            process.env.FRONTEND_URL,
            process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : null
        ].filter(Boolean);
        if (!origin || allowed.includes(origin) || process.env.NODE_ENV === 'production') return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Stricter rate limit only on login & register (not /me or other auth routes)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many attempts, try again later.' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/', (req, res) => res.sendFile(__dirname + '/alibaba-style.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/login.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/admin.html'));
app.use(express.static('.'));

// Temporary seed route - remove after first use
app.get('/api/seed-now', async (req, res) => {
    try {
        const User = require('./models/User');
        const Product = require('./models/Product');
        const bcrypt = require('bcryptjs');
        const existing = await User.findOne({ where: { email: 'admin@jobijad.com' } });
        if (existing) return res.json({ message: 'Already seeded! Login with admin@jobijad.com / admin123' });
        await User.create({ name: 'Admin', email: 'admin@jobijad.com', password: 'admin123', role: 'admin' });
        await User.create({ name: 'John Doe', email: 'customer@example.com', password: 'customer123', role: 'customer' });
        res.json({ message: 'Users created! Login with admin@jobijad.com / admin123' });
    } catch(e) {
        res.json({ error: e.message });
    }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/feedback', require('./routes/feedback'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.use('*', (req, res) => {
    // Return 404 page for browser requests, JSON for API
    if (req.headers.accept?.includes('text/html')) {
        return res.status(404).sendFile(__dirname + '/404.html');
    }
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Sync DB then start server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('PostgreSQL connected & tables synced');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });
