const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get dashboard stats (admin)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get total revenue
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' }
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get order counts
    const totalOrders = await prisma.order.count();
    const pendingVerification = await prisma.order.count({
      where: { verificationStatus: 'PENDING' }
    });
    const completedShipments = await prisma.order.count({
      where: { orderStatus: 'DELIVERED' }
    });

    // Get product count
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
      where: { active: true }
    });

    // Get user count
    const totalUsers = await prisma.user.count();
    const customerCount = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    // Get promo code count
    const activePromos = await prisma.promoCode.count({
      where: { active: true }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
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

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['orderStatus'],
      _count: true
    });

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        paymentStatus: 'PAID'
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    // Process monthly revenue
    const revenueByMonth = {};
    monthlyRevenue.forEach(order => {
      const month = order.createdAt.toISOString().slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
    });

    res.json({
      totalRevenue,
      totalOrders,
      pendingVerification,
      completedShipments,
      totalProducts,
      activeProducts,
      totalUsers,
      customerCount,
      adminCount,
      activePromos,
      recentOrders,
      ordersByStatus,
      revenueByMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales chart data (admin)
router.get('/chart', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'PAID'
      },
      select: {
        totalAmount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
    });

    res.json(salesByDate);
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
