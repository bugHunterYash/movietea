const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Rate limiting for pre-orders (max 5 requests per IP per hour)
const preorderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many pre-order requests from this IP, please try again after an hour' }
});

// Helper to generate reference ID
const generateReferenceId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `PRE-${dateStr}-${randomStr}`;
};

// POST /api/preorders - Create a pre-order
router.post('/', preorderLimiter, async (req, res) => {
  try {
    const { productId, name, email, phone, notes, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (!productId || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Product validation
    const product = await prisma.product.findFirst({ 
      where: { 
        OR: [
          { id: productId },
          { slug: productId }
        ]
      } 
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Duplicate detection (same email & product within 24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await prisma.preOrder.findFirst({
      where: {
        email,
        productId: product.id,
        createdAt: { gte: twentyFourHoursAgo }
      }
    });

    if (existing) {
      return res.status(429).json({ error: 'You have already requested this product recently.' });
    }

    const preOrder = await prisma.preOrder.create({
      data: {
        referenceId: generateReferenceId(),
        productId: product.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        notes,
        source,
        ipAddress,
        userAgent,
      },
    });

    res.status(201).json(preOrder);
  } catch (error) {
    console.error('Failed to create pre-order:', error);
    res.status(500).json({ error: 'Failed to create pre-order' });
  }
});

// GET /api/preorders - Admin fetch all pre-orders (excluding soft deleted)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const preOrders = await prisma.preOrder.findMany({
      where: { deleted: false },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(preOrders);
  } catch (error) {
    console.error('Failed to fetch pre-orders:', error);
    res.status(500).json({ error: 'Failed to fetch pre-orders' });
  }
});

// PUT /api/preorders/:id/status - Admin update status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const preOrder = await prisma.preOrder.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(preOrder);
  } catch (error) {
    console.error('Failed to update pre-order status:', error);
    res.status(500).json({ error: 'Failed to update pre-order status' });
  }
});

// DELETE /api/preorders/:id - Admin soft delete
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.preOrder.update({
      where: { id: req.params.id },
      data: { deleted: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete pre-order:', error);
    res.status(500).json({ error: 'Failed to delete pre-order' });
  }
});

module.exports = router;
