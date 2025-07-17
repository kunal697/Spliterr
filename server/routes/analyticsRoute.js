const express = require('express');
const router = express.Router();
const {getAnalytics} = require('../controllers/analyticsController');

// get Analytics
router.get('/',getAnalytics);

module.exports = router; 