const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/predict', require('./routes/predictRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CrickBase API Server',
    version: '1.0.0',
    endpoints: {
      players: '/api/players',
      getAllPlayers: 'GET /api/players',
      getPlayer: 'GET /api/players/:id',
      createPlayer: 'POST /api/players',
      updatePlayer: 'PUT /api/players/:id',
      deletePlayer: 'DELETE /api/players/:id'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: '/api/players'
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crickbase';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

