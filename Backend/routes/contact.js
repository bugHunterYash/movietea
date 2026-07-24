const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailResponse = await sendContactEmail(name, email, message);

    if (emailResponse) {
      res.status(200).json({ message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
