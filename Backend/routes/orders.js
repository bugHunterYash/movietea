const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();

// Multer for screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image/PDF files are allowed'));
  }
});

// Generate order number
const generateOrderNumber = async () => {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  const lastNum = lastOrder ? parseInt(lastOrder.orderNumber.replace('MOV-', '')) : 8909;
  return `MOV-${lastNum + 1}`;
};

const { sendOrderConfirmationEmail } = require('../services/emailService');

// Create order (authenticated user)
router.post('/', authenticateToken, upload.single('screenshot'), async (req, res) => {
  try {
    const { items: rawItems, totalAmount, paymentMethod, address1, address2, city, state, pincode, promoCodeId } = req.body;
    const user = req.user;

    const items = typeof rawItems === 'string' ? JSON.parse(rawItems) : rawItems;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order with items in a transaction to ensure atomic saves
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          customerName: user.name || 'Customer',
          customerEmail: user.email,
          customerPhone: user.phone,
          totalAmount: parseInt(totalAmount),
          paymentMethod: paymentMethod || 'UPI',
          address1,
          address2,
          city,
          state,
          pincode,
          screenshotUrl: req.file ? `/uploads/${req.file.filename}` : null,
          promoCodeId: promoCodeId || null,
          items: {
            create: items.map(item => ({
              productId: item.id || item.productId,
              name: item.name,
              price: parseInt(item.price),
              quantity: parseInt(item.quantity)
            }))
          }
        },
        include: {
          items: true,
          user: true
        }
      });

      // Create Payment Record (Task item from checkout flow)
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: newOrder.totalAmount,
          method: newOrder.paymentMethod,
          status: 'UNPAID', // Pending verification
          screenshotUrl: newOrder.screenshotUrl
        }
      });

      // Reduce stock (Task item)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id || item.productId },
          data: { stock: { decrement: parseInt(item.quantity) } }
        });
      }

      return newOrder;
    });

    // Send order confirmation email asynchronously (do not await to block response)
    sendOrderConfirmationEmail(order, order.user?.email).catch(console.error);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
        promoCode: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        promoCode: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        promoCode: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order verification status (admin)
router.put('/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { verificationStatus, paymentStatus } = req.body;
    
    const updateData = {};
    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus;
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    // If approved, set payment status to PAID
    if (verificationStatus === 'APPROVED') {
      updateData.paymentStatus = 'PAID';
    }
    // If rejected, keep payment status as UNPAID
    if (verificationStatus === 'REJECTED') {
      updateData.paymentStatus = 'UNPAID';
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order verification error:', error);
    res.status(500).json({ error: 'Failed to update order verification' });
  }
});

// Update order status (admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { orderStatus },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
