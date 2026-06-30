const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get cart items for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            image: true,
            stock: true,
            active: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart (or increment quantity if already exists)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!product.active) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } }
    });

    if (existingItem) {
      const newQty = existingItem.quantity + (quantity || 1);
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true }
      });
      return res.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId,
        quantity: quantity || 1
      },
      include: { product: true }
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await prisma.cartItem.findUnique({ where: { id: req.params.id } });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: req.params.id } });
      return res.json({ message: 'Item removed from cart' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity },
      include: { product: true }
    });
    res.json(updated);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id: req.params.id } });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// Clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Admin: clear a specific user's cart (called after order approval)
router.delete('/user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.params.userId } });
    res.json({ message: 'User cart cleared' });
  } catch (error) {
    console.error('Admin clear user cart error:', error);
    res.status(500).json({ error: 'Failed to clear user cart' });
  }
});

module.exports = router;
