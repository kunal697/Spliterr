const Expense = require('../models/expenseModel'); // Assuming you have an Expense model defined 

const validateExpense = (expense) => {
  const { amount, description, paid_by, shared_with, split_type, split_values, category, is_recurring, recurring_type, recurring_interval, recurring_end_date } = expense;

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

  if (!category || !["Food", "Travel", "Utilities", "Entertainment", "Other"].includes(category)) {
    return { valid: false, message: "Invalid category" };
  }

  if ((split_type === "percentage" || split_type === "exact")) {
    if (!Array.isArray(split_values) || split_values.length !== shared_with.length) {
      return { valid: false, message: "split_values must match length of shared_with" };
    }

    if (split_values.some((val) => val < 0)) {
      return { valid: false, message: "Split values must not contain negative numbers" };
    }

    const sum = split_values.reduce((acc, val) => acc + val, 0);

    if (split_type === "percentage" && Math.round(sum) !== 100) {
      return { valid: false, message: "Percentage split must total 100%" };
    }

    if (split_type === "exact" && Math.round(sum * 100) !== Math.round(amount * 100)) {
      return { valid: false, message: "Exact split must total the full amount" };
    }
  }

  // Recurring validation
  if (is_recurring) {
    if (!recurring_type || !["daily", "weekly", "monthly", "yearly"].includes(recurring_type)) {
      return { valid: false, message: "Invalid recurring type" };
    }
    if (!recurring_interval || recurring_interval < 1) {
      return { valid: false, message: "Invalid recurring interval" };
    }
    if (recurring_end_date && isNaN(Date.parse(recurring_end_date))) {
      return { valid: false, message: "Invalid recurring end date" };
    }
  }

  return { valid: true };
};



const addExpense = async (req, res) => {
  try {
    const { amount, description, paid_by, shared_with, split_type, split_values, category, is_recurring, recurring_type, recurring_interval, recurring_end_date, recurring_parent_id } = req.body;

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
      category,
      is_recurring: is_recurring || false,
      recurring_type: is_recurring ? recurring_type : "none",
      recurring_interval: is_recurring ? recurring_interval : 1,
      recurring_end_date: is_recurring ? recurring_end_date : undefined,
      recurring_parent_id: recurring_parent_id || undefined,
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