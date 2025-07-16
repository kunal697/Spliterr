const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    paid_by: { type: String, required: true },
    shared_with: [{ type: String, required: true }],
    split_type: {
      type: String,
      enum: ["equal", "exact", "percentage"],
      default: "equal",
    },
    split_values: [{ type: Number }],
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;