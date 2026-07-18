const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { orderNumber: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products for admin (including inactive)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { orderNumber: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (admin)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, price, discountPrice, stock, orderNumber, category, flavorType, desc, shortDesc, active, featured } = req.body;

    // Check if slug already exists
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Product slug already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: parseInt(price),
        discountPrice: discountPrice ? parseInt(discountPrice) : null,
        stock: parseInt(stock) || 0,
        orderNumber: parseInt(orderNumber) || 0,
        category: category || 'Loose Leaf',
        flavorType,
        desc,
        shortDesc,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        active: active === 'true' || active === true,
        featured: featured === 'true' || featured === true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (admin)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, price, discountPrice, stock, orderNumber, category, flavorType, desc, shortDesc, active, featured } = req.body;

    const updateData = {
      name,
      slug,
      price: parseInt(price),
      discountPrice: discountPrice ? parseInt(discountPrice) : null,
      stock: parseInt(stock) || 0,
      orderNumber: parseInt(orderNumber) || 0,
      category: category || 'Loose Leaf',
      flavorType,
      desc,
      shortDesc,
      active: active === 'true' || active === true,
      featured: featured === 'true' || featured === true
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product order (admin)
router.put('/:id/reorder', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderNumber } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { orderNumber: parseInt(orderNumber) }
    });
    res.json(product);
  } catch (error) {
    console.error('Update product order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
