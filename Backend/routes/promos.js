const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all promo codes (admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

// Validate promo code (public)
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    if (!promo.active) {
      return res.status(400).json({ error: 'Promo code is inactive' });
    }

    if (new Date(promo.validity) < new Date()) {
      return res.status(400).json({ error: 'Promo code has expired' });
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ error: 'Promo code usage limit reached' });
    }

    res.json({
      valid: true,
      id: promo.id,
      code: promo.code,
      discountAmount: promo.discountAmount,
      discountPercent: promo.discountPercent,
      originalPrice: promo.originalPrice,
      discountedPrice: promo.discountedPrice
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// Create promo code (admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, discountAmount, discountPercent, originalPrice, discountedPrice, validity, usageLimit, active } = req.body;

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountAmount: discountAmount ? parseInt(discountAmount) : 0,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        discountedPrice: discountedPrice ? parseInt(discountedPrice) : null,
        validity: new Date(validity),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        active: active !== false
      }
    });

    res.status(201).json(promo);
  } catch (error) {
    console.error('Create promo error:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// Update promo code (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, discountAmount, discountPercent, originalPrice, discountedPrice, validity, usageLimit, active } = req.body;

    const promo = await prisma.promoCode.update({
      where: { id: req.params.id },
      data: {
        code: code.toUpperCase(),
        discountAmount: discountAmount ? parseInt(discountAmount) : 0,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        discountedPrice: discountedPrice ? parseInt(discountedPrice) : null,
        validity: validity ? new Date(validity) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        active
      }
    });

    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update promo code' });
  }
});

// Delete promo code (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.promoCode.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete promo code' });
  }
});

module.exports = router;
