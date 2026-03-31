const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// ===== IMAGE UPLOAD =====
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});

router.post('/upload-image', adminAuth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url });
    });
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Admin requests (with valid admin token) can see all products
        let isAdmin = false;
        try {
            const jwt = require('jsonwebtoken');
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
                if (decoded.role === 'admin') isAdmin = true;
            }
        } catch(e) { /* not admin */ }

        const where = isAdmin ? {} : { isActive: true };

        if (req.query.category) where.category = req.query.category;
        if (req.query.featured === 'true') where.featured = true;
        if (req.query.search) where.name = { [Op.iLike]: `%${req.query.search}%` };

        const { count, rows } = await Product.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']] });
        res.json({ products: rows, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', adminAuth, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.update(req.body);
        res.json({ message: 'Product updated', product });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.update({ isActive: false });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
