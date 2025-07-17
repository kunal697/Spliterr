const Expense = require('../models/expenseModel');

const getAnalytics = async (req, res) => {
  try {
    const [monthly, categorySummary, topCategories, topTransactions] = await Promise.all([
      // Monthly Summary
      Expense.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
      ]).then(data =>
        data.map(row => ({
          month: `${row._id.year}-${row._id.month.toString().padStart(2, "0")}`,
          total: row.total
        }))
      ),

      // Category Summary
      Expense.aggregate([
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        { $sort: { total: -1 } },
      ]).then(data =>
        data.map(row => ({
          category: row._id,
          total: row.total
        }))
      ),

      // Top 5 Categories
      Expense.aggregate([
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]).then(data =>
        data.map(row => ({
          category: row._id,
          total: row.total
        }))
      ),

      // Top 5 Transactions
      Expense.find().sort({ amount: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        monthly,
        categorySummary,
        topCategories,
        topTransactions,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getAnalytics };
