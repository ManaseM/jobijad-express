const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId, items: [], total: 0 });
    return cart;
}

router.get('/', auth, async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user.userId);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findByPk(productId);
        if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });

        const cart = await getOrCreateCart(req.user.userId);
        const items = [...cart.items];
        const idx = items.findIndex(i => i.productId === productId);

        if (idx > -1) { items[idx].quantity += quantity; }
        else { items.push({ productId, name: product.name, price: product.price, quantity, image: product.images[0]?.url }); }

        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
        await cart.update({ items, total });
        res.json({ message: 'Added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user.userId);
        await cart.update({ items: [], total: 0 });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
