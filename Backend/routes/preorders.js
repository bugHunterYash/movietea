const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/preorders - Create a pre-order
router.post('/', async (req, res) => {
  try {
    const { productId, name, phone } = req.body;

    if (!productId || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const preOrder = await prisma.preOrder.create({
      data: {
        productId,
        name,
        phone,
      },
    });

    res.status(201).json(preOrder);
  } catch (error) {
    console.error('Failed to create pre-order:', error);
    res.status(500).json({ error: 'Failed to create pre-order' });
  }
});

// GET /api/preorders - Admin fetch all pre-orders
router.get('/', async (req, res) => {
  try {
    const preOrders = await prisma.preOrder.findMany({
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
router.put('/:id/status', async (req, res) => {
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

// DELETE /api/preorders/:id - Admin delete
router.delete('/:id', async (req, res) => {
  try {
    await prisma.preOrder.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete pre-order:', error);
    res.status(500).json({ error: 'Failed to delete pre-order' });
  }
});

module.exports = router;
