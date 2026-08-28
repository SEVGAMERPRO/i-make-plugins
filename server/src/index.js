require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const pluginRoutes = require('./routes/plugins');
const userRoutes = require('./routes/users');
const customRequestsRoutes = require('./routes/customRequests');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const ordersRoutes = require('./routes/orders');
const paypalRoutes = require('./routes/paypal');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Force HTTPS & Set Enterprise SSL Security Headers
app.enable('trust proxy');
app.use((req, res, next) => {
  // 1. Force 301 Redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }

  // 2. SSL/TLS Browser Padlock & Security Headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://minoforge.com',
    'https://www.minoforge.com',
    process.env.CLIENT_URL || 'http://localhost:5173'
  ],
  credentials: true
}));

// Rate limiting with localhost & development bypass
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || req.path.startsWith('/api/auth/staff');
  }
});
app.use(limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', customRequestsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/paypal', paypalRoutes);

// SEO Sitemaps & Robots
app.get('/sitemap.xml', (req, res) => {
  const p1 = path.resolve(__dirname, '../../client/dist/sitemap.xml');
  const p2 = path.resolve(__dirname, '../../client/public/sitemap.xml');
  const target = fs.existsSync(p1) ? p1 : p2;
  res.header('Content-Type', 'application/xml');
  res.sendFile(target);
});

app.get('/robots.txt', (req, res) => {
  const p1 = path.resolve(__dirname, '../../client/dist/robots.txt');
  const p2 = path.resolve(__dirname, '../../client/public/robots.txt');
  const target = fs.existsSync(p1) ? p1 : p2;
  res.header('Content-Type', 'text/plain');
  res.sendFile(target);
});

// Serve Frontend Static Assets (client/dist) in Production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT} (0.0.0.0:${PORT})`);
});
