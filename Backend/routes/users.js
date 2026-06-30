const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all users (admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        pincode: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            orderStatus: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role (admin)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['ADMIN', 'CUSTOMER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent changing own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Promote or demote a user by email (admin)
router.put('/promote-by-email', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!['ADMIN', 'CUSTOMER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be ADMIN or CUSTOMER' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ error: 'No user found with this email address' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json({ message: `User ${updated.email} is now ${updated.role}`, user: updated });
  } catch (error) {
    console.error('Promote by email error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Update user profile (authenticated user)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address1, address2, city, state, pincode } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
        address1,
        address2,
        city,
        state,
        pincode
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        pincode: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
