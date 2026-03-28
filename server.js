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

// Seed products route
app.get('/api/seed-products', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const count = await Product.count();
        if (count > 30) return res.json({ message: count + ' products already exist.' });
        const products = [
            { name: 'Kitenge Maxi Wrap Dress', price: 89.99, category: 'women', description: 'Elegant wrap-style kitenge maxi dress.', images: [{ url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=500&fit=crop', alt: 'Kitenge Wrap Dress' }], sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 10 }], featured: true },
            { name: 'Ankara Peplum Blouse', price: 55.99, category: 'women', description: 'Chic peplum blouse in bold ankara print.', images: [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop', alt: 'Ankara Peplum' }], sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 9 }], featured: false },
            { name: 'Kitenge Off-Shoulder Gown', price: 115.00, category: 'women', description: 'Glamorous off-shoulder kitenge gown.', images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop', alt: 'Off Shoulder Gown' }], sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 7 }], featured: true },
            { name: 'African Print Bodycon Dress', price: 67.99, category: 'women', description: 'Fitted bodycon dress in vibrant African print.', images: [{ url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop', alt: 'Bodycon Dress' }], sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 10 }], featured: false },
            { name: 'Kitenge Skirt & Blouse Set', price: 78.99, category: 'women', description: 'Matching kitenge skirt and blouse set.', images: [{ url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop', alt: 'Skirt Blouse Set' }], sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 8 }], featured: false },
            { name: 'Ankara Flare Midi Dress', price: 72.99, category: 'women', description: 'Beautiful flare-cut ankara midi dress.', images: [{ url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop', alt: 'Flare Midi Dress' }], sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 9 }], featured: true },
            { name: 'Kitenge Jumpsuit', price: 85.00, category: 'women', description: 'Trendy wide-leg kitenge jumpsuit.', images: [{ url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop', alt: 'Kitenge Jumpsuit' }], sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 7 }], featured: false },
            { name: 'African Print Evening Gown', price: 135.00, category: 'women', description: 'Stunning African print evening gown.', images: [{ url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=500&fit=crop', alt: 'Evening Gown' }], sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 6 }], featured: true },
            { name: 'Kitenge Pencil Dress', price: 79.99, category: 'women', description: 'Sleek kitenge pencil dress for office.', images: [{ url: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=500&fit=crop', alt: 'Pencil Dress' }], sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 8 }], featured: false },
            { name: 'Ankara Crop Top & Skirt', price: 65.99, category: 'women', description: 'Stylish ankara crop top and skirt set.', images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop', alt: 'Crop Top Skirt' }], sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 10 }], featured: false },
            { name: 'Kitenge Shirt Dress', price: 69.99, category: 'women', description: 'Casual kitenge shirt dress.', images: [{ url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=500&fit=crop', alt: 'Shirt Dress' }], sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 9 }], featured: false },
            { name: 'African Wax Print Sundress', price: 58.99, category: 'women', description: 'Light and breezy African wax print sundress.', images: [{ url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=500&fit=crop', alt: 'Sundress' }], sizes: [{ size: 'S', stock: 9 }, { size: 'M', stock: 11 }], featured: false },
            { name: 'Kitenge Wrap Skirt', price: 45.99, category: 'women', description: 'Versatile kitenge wrap skirt.', images: [{ url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop', alt: 'Wrap Skirt' }], sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 12 }], featured: false },
            { name: 'Ankara Palazzo Trousers', price: 52.99, category: 'women', description: 'Wide-leg ankara palazzo trousers.', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop', alt: 'Palazzo Trousers' }], sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 9 }], featured: false },
            { name: 'Kitenge Mermaid Dress', price: 99.99, category: 'women', description: 'Dramatic kitenge mermaid dress for weddings.', images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&h=500&fit=crop', alt: 'Mermaid Dress' }], sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 6 }], featured: true },
            { name: "Men's Kitenge Shirt", price: 55.99, category: 'men', description: 'Classic fit kitenge shirt with African patterns.', images: [{ url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop', alt: "Men's Kitenge Shirt" }], sizes: [{ size: 'M', stock: 8 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 7 }], featured: true },
            { name: "Men's Ankara Kaftan", price: 72.99, category: 'men', description: 'Traditional African kaftan in premium ankara.', images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', alt: "Men's Kaftan" }], sizes: [{ size: 'M', stock: 7 }, { size: 'L', stock: 9 }], featured: true },
            { name: "Men's Kitenge Suit", price: 145.00, category: 'men', description: 'Sharp kitenge suit with matching trousers.', images: [{ url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop', alt: "Men's Suit" }], sizes: [{ size: 'M', stock: 5 }, { size: 'L', stock: 7 }], featured: true },
            { name: 'Traditional Dashiki', price: 42.99, category: 'men', description: 'Authentic dashiki with beautiful embroidery.', images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop', alt: 'Dashiki' }], sizes: [{ size: 'M', stock: 9 }, { size: 'L', stock: 11 }], featured: false },
            { name: "Men's Ankara Trousers", price: 58.99, category: 'men', description: 'Comfortable ankara trousers with modern fit.', images: [{ url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=500&fit=crop', alt: "Men's Trousers" }], sizes: [{ size: '32', stock: 7 }, { size: '34', stock: 9 }], featured: false },
            { name: "Men's Kitenge Blazer", price: 95.00, category: 'men', description: 'Stylish kitenge blazer for formal occasions.', images: [{ url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=500&fit=crop', alt: "Men's Blazer" }], sizes: [{ size: 'M', stock: 6 }, { size: 'L', stock: 8 }], featured: true },
            { name: "Men's African Print Shorts", price: 35.99, category: 'men', description: 'Casual African print shorts for summer.', images: [{ url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=500&fit=crop', alt: "Men's Shorts" }], sizes: [{ size: 'M', stock: 10 }, { size: 'L', stock: 12 }], featured: false },
            { name: "Men's Kitenge Polo Shirt", price: 48.99, category: 'men', description: 'Smart kitenge polo shirt for casual wear.', images: [{ url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop', alt: "Men's Polo" }], sizes: [{ size: 'M', stock: 8 }, { size: 'L', stock: 10 }], featured: false },
            { name: "Men's Ankara Agbada", price: 165.00, category: 'men', description: 'Majestic ankara agbada for ceremonies.', images: [{ url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=500&fit=crop', alt: "Men's Agbada" }], sizes: [{ size: 'M', stock: 4 }, { size: 'L', stock: 6 }], featured: true },
            { name: "Men's Kitenge Joggers", price: 52.99, category: 'men', description: 'Comfortable kitenge joggers.', images: [{ url: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&h=500&fit=crop', alt: "Men's Joggers" }], sizes: [{ size: 'M', stock: 9 }, { size: 'L', stock: 11 }], featured: false },
            { name: "Men's African Print Jacket", price: 88.99, category: 'men', description: 'Bold African print jacket.', images: [{ url: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=500&fit=crop', alt: "Men's Jacket" }], sizes: [{ size: 'M', stock: 6 }, { size: 'L', stock: 8 }], featured: false },
            { name: "Men's Kitenge Waistcoat", price: 62.99, category: 'men', description: 'Elegant kitenge waistcoat.', images: [{ url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop', alt: "Men's Waistcoat" }], sizes: [{ size: 'M', stock: 7 }, { size: 'L', stock: 9 }], featured: false },
            { name: "Men's Ankara Senator Suit", price: 125.00, category: 'men', description: 'Distinguished ankara senator suit.', images: [{ url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop', alt: "Senator Suit" }], sizes: [{ size: 'M', stock: 5 }, { size: 'L', stock: 7 }], featured: true },
            { name: "Men's Kitenge Shirt & Trouser Set", price: 98.99, category: 'men', description: 'Matching kitenge shirt and trouser set.', images: [{ url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop', alt: "Shirt Trouser Set" }], sizes: [{ size: 'M', stock: 6 }, { size: 'L', stock: 8 }], featured: false },
            { name: "Men's African Boubou", price: 78.99, category: 'men', description: 'Traditional African boubou in premium fabric.', images: [{ url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=500&fit=crop', alt: "Men's Boubou" }], sizes: [{ size: 'M', stock: 7 }, { size: 'L', stock: 9 }], featured: false }
        ];
        for (const p of products) await Product.create(p);
        res.json({ message: products.length + ' products created!' });
    } catch(e) {
        res.json({ error: e.message });
    }
});
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
