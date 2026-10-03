const express = require('express');
const mongoose = require('mongoose');
const { successResponse } = require('../utils/response');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'taskflow-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.get('/db', (req, res) => {
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const isConnected = mongoose.connection.readyState === 1;
  
  const data = {
    status: isConnected ? 'healthy' : 'unhealthy',
    service: 'taskflow-api',
    database: isConnected ? 'connected' : 'disconnected'
  };

  if (isConnected) {
    res.status(200).json(data);
  } else {
    res.status(503).json(data);
  }
});

module.exports = router;
