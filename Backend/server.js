const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const seed = require('./seed');
seed().catch(console.error);

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', apiLimiter);

// Session configuration
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const promoRoutes = require('./routes/promos');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const preorderRoutes = require('./routes/preorders');
const contactRoutes = require('./routes/contact');
const webhookRoutes = require('./routes/webhooks');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.status(200).send('MOVITEA API is live! Uptime checks pass.');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MOVITEA Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MOVITEA Backend running on port ${PORT}`);
});

module.exports = app;
