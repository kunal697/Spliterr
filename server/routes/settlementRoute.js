const express = require('express');
const router = express.Router();
const {   getBalances, getSettlements,getAllPeople, } = require('../controllers/settlementController');

// Route to get all people involved in expenses
router.get('/people', getAllPeople);

// Route to get balance information
router.get('/balances', getBalances);

// Route to get settlement information
router.get('/', getSettlements);

module.exports = router;
