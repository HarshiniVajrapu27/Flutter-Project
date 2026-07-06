require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainers');
const bookingRoutes = require('./routes/bookings');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.dbType()
  });
});

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Server start wrapper
const startServer = async () => {
  // Try connecting database first
  await db.connect();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Skill Sharing Among Villagers Server running on port ${PORT}`);
    console.log(` Running in [${db.dbType().toUpperCase()}] Database mode.`);
    console.log(`====================================================`);
  });
};

startServer();
