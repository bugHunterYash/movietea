const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// In a real production app, verify the Resend Webhook Signature here
// using headers['svix-signature'] or Resend's webhook secret.

router.post('/resend', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Resend wraps the payload in `data` and uses `type` for the event
    // e.g. email.delivered, email.opened
    
    if (!data || !data.email_id) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const resendId = data.email_id;
    const timestamp = new Date(data.created_at || Date.now());

    // Find the email log by resendId
    const emailLog = await prisma.emailLog.findUnique({
      where: { resendId }
    });

    if (!emailLog) {
      // If we don't have this email logged, ignore it
      return res.status(200).send('Ignored');
    }

    const updates = {};

    switch (type) {
      case 'email.delivered':
        updates.status = 'DELIVERED';
        updates.deliveredAt = timestamp;
        break;
      case 'email.opened':
        updates.status = 'OPENED';
        updates.opens = { increment: 1 };
        updates.lastOpenedAt = timestamp;
        break;
      case 'email.clicked':
        updates.status = 'CLICKED';
        updates.clicks = { increment: 1 };
        updates.lastClickedAt = timestamp;
        break;
      case 'email.bounced':
        updates.status = 'BOUNCED';
        updates.bouncedAt = timestamp;
        updates.failedReason = 'Bounced';
        break;
      case 'email.complained':
        updates.failedReason = 'Complained (Spam)';
        break;
      default:
        break;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: updates
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
