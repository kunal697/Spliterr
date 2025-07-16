const Expense = require("../models/expenseModel.js");
const { calculateBalances, simplifySettlements } = require("../utils/settlementUtils.js");

const getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = calculateBalances(expenses);

    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSettlements = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = calculateBalances(expenses);
    const settlements = simplifySettlements(balances);

    res.status(200).json({
      success: true,
      data: settlements,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllPeople = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const people = new Set();

    expenses.forEach(exp => {
      people.add(exp.paid_by);
      exp.shared_with.forEach(p => people.add(p));
    });

    res.status(200).json({
      success: true,
      data: Array.from(people),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getBalances,
  getSettlements,
  getAllPeople,
};
