const Expense = require('../models/expenseModel'); // Assuming you have an Expense model defined 

const validateExpense = (expense) => {
  const { amount, description, paid_by, shared_with, split_type, split_values } = expense;

  if (!amount || amount <= 0) {
    return { valid: false, message: "Invalid amount" };
  }

  if (!description || description.trim().length === 0) {
    return { valid: false, message: "Invalid description" };
  }

  if (!paid_by || paid_by.trim().length === 0) {
    return { valid: false, message: "Invalid paid_by" };
  }

  if (!Array.isArray(shared_with) || shared_with.length === 0) {
    return { valid: false, message: "Invalid shared_with" };
  }

  if ((split_type === "percentage" || split_type === "exact")) {
    if (!Array.isArray(split_values) || split_values.length !== shared_with.length) {
      return { valid: false, message: "split_values must match length of shared_with" };
    }

    const sum = split_values.reduce((acc, val) => acc + val, 0);

    if (split_type === "percentage" && Math.round(sum) !== 100) {
      return { valid: false, message: "Percentage split must total 100%" };
    }

    if (split_type === "exact" && Math.round(sum * 100) !== Math.round(amount * 100)) {
      return { valid: false, message: "Exact split must total the full amount" };
    }
  }

  return { valid: true };
};


const addExpense = async (req, res) => {
  try {
    const { amount, description, paid_by, shared_with, split_type, split_values } = req.body;

    const validation = validateExpense(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const expense = new Expense({
      amount,
      description,
      paid_by,
      shared_with,
      split_type: split_type || "equal",
      split_values: split_values || [],
    });

    await expense.save();
    res.status(201).json({
      success: true,
      data: expense,
      message: "Expense added successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateExpense(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }
    const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({
      success: true,
      data: updated,
      message: "Expense updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
}