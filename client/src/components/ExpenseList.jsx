import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit, Users, Calendar, IndianRupee, Repeat } from "lucide-react";
import { useExpense } from "../contexts/ExpenseContext";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";
import EditExpenseModal from "./EditExpenseModal"; 
import toast from "react-hot-toast";

export function ExpenseList() {
  const {
    expenses,
    deleteExpense,
    loading,
    fetchExpenses,
  } = useExpense();

  const [editingExpense, setEditingExpense] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [expandedSplit, setExpandedSplit] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    setToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(toDelete);
      setToDelete(null);
      setShowConfirm(false);
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Failed to delete expense:", error.message);
      toast.error(error.message || "Failed to delete expense");
    }
  };

  const cancelDelete = () => {
    setToDelete(null);
    setShowConfirm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSplitTypeColor = (splitType) => {
    switch (splitType) {
      case "equal":
        return "bg-green-100 text-green-800 border-green-200";
      case "percentage":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "exact":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateSplitAmounts = (expense) => {
    const { amount, shared_with, split_type, split_values } = expense;

    switch (split_type) {
      case "equal":
        const equalAmount = amount / shared_with.length;
        return shared_with.map((person) => ({
          person,
          amount: equalAmount,
          display: `${equalAmount.toFixed(2)}`,
        }));

      case "percentage":
        return shared_with.map((person, index) => {
          const percentage = split_values[index] || 0;
          const splitAmount = (amount * percentage) / 100;
          return {
            person,
            amount: splitAmount,
            display: `${splitAmount.toFixed(2)} (${percentage}%)`,
          };
        });

      case "exact":
        return shared_with.map((person, index) => {
          const exactAmount = split_values[index] || 0;
          return {
            person,
            amount: exactAmount,
            display: `${exactAmount.toFixed(2)}`,
          };
        });

      default:
        return [];
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IndianRupee className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500 mb-6">Add your first expense to get started</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {expenses.length} expense{expenses.length !== 1 ? "s" : ""} total
      </div>

      <AnimatePresence>
        {expenses.map((expense, index) => (
          <motion.div
            key={expense._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{expense.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700">{expense.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(expense.createdAt)}</span>
                    </div>
                    {/* Category badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200`}>
                      {expense.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit expense"
                    onClick={() => setEditingExpense(expense)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 min-w-[80px]">Paid by:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {expense.paid_by.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{expense.paid_by}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 min-w-[80px]">Split type:</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSplitTypeColor(expense.split_type)}`}>
                    {expense.split_type.charAt(0).toUpperCase() + expense.split_type.slice(1)}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-600 mt-0.5" />
                  <span className="text-sm text-gray-600 min-w-[80px]">Split details:</span>

                  <div className="flex-1">
                    <button
                      onClick={() => setExpandedSplit(expandedSplit === expense._id ? null : expense._id)}
                      className="text-sm text-blue-600 hover:underline focus:outline-none"
                    >
                      {expandedSplit === expense._id ? "Hide details" : "View details"}
                    </button>

                    <AnimatePresence>
                      {expandedSplit === expense._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-4 space-y-2"
                        >
                          {calculateSplitAmounts(expense).map((split, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {split.person.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{split.person}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-800">
                                ₹{split.display}
                              </span>
                            </div>
                          ))}

                          {(expense.split_type === 'exact' || expense.split_type === 'percentage') && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Total:</span>
                                <span>
                                  {expense.split_type === 'exact' 
                                    ? `₹${calculateSplitAmounts(expense).reduce((sum, split) => sum + split.amount, 0).toFixed(2)}`
                                    : `${expense.split_values?.reduce((sum, val) => sum + val, 0) || 0}%`
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this expense?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
