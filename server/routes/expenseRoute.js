const express = require('express');
const router = express.Router();
const { addExpense,getAllExpenses,updateExpense,deleteExpense } = require('../controllers/expensesController');

// Route to add an expense
router.post('/', addExpense);

// Route to get all expenses
router.get('/', getAllExpenses);

// Route to update an expense
router.put('/:id', updateExpense);

// Route to delete an expense
router.delete('/:id', deleteExpense);

module.exports = router;