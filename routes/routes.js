const express = require('express');
const urlRoutes = require('./url');
const analyticsRoutes = require('./analytics');
const authRoutes = require('./auth');

const router = express.Router();

router.use('/url', urlRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);

module.exports = router;
