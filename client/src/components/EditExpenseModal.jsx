import React, { useState, useEffect } from 'react';
import { IndianRupee, X } from 'lucide-react';
import { useExpense } from '../contexts/ExpenseContext';
import toast from 'react-hot-toast';

const EditExpenseModal = ({ expense, onClose }) => {
  const {
    updateExpense,
    people,
    fetchPeople,
    fetchExpenses,
    fetchBalances,
    fetchSettlements,
  } = useExpense();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paid_by: '',
    shared_with: [],
    split_type: 'equal',
    split_values: [],
    category: 'Other',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        paid_by: expense.paid_by,
        shared_with: expense.shared_with || [],
        split_type: expense.split_type,
        split_values: expense.split_values || [],
        category: expense.category || 'Other',
      });
    }
  }, [expense]);

  // Handle checkbox toggle
  const toggleSharedWith = (person) => {
    const updated = formData.shared_with.includes(person)
      ? formData.shared_with.filter((p) => p !== person)
      : [...formData.shared_with, person];
    setFormData({
      ...formData,
      shared_with: updated,
      split_values: [], // reset on change
    });
  };

  const handleSplitValueChange = (e, index) => {
    const updated = [...formData.split_values];
    updated[index] = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, split_values: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await updateExpense(expense._id, expenseData);

      // Refresh all data
      fetchExpenses();
      fetchBalances();
      fetchSettlements();
      
      // Close modal
      toast.success("Expense updated successfully");
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error(error.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const showSplitInputs =
    formData.split_type !== 'equal' && formData.shared_with.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Expense</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What was this expense for?"
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paid by</label>
            <select
              required
              value={formData.paid_by}
              onChange={(e) => setFormData({ ...formData, paid_by: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select person</option>
              {people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          {/* Shared With */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shared with</label>
            <div className="flex flex-wrap gap-4">
              {people.map((person) => (
                <label key={person} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.shared_with.includes(person)}
                    onChange={() => toggleSharedWith(person)}
                    className="accent-blue-600"
                  />
                  <span>{person}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split type</label>
            <select
              value={formData.split_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  split_type: e.target.value,
                  split_values: [],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="equal">Equal</option>
              <option value="percentage">Percentage</option>
              <option value="exact">Exact</option>
            </select>
          </div>

          {/* Custom Split Values */}
          {showSplitInputs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.split_type === 'percentage' ? 'Percentage Split (%)' : 'Exact Amounts'}
              </label>
              {formData.shared_with.map((user, index) => (
                <div key={user} className="flex items-center mb-2 gap-2">
                  <span className="w-32">{user}</span>
                  <input
                    type="number"
                    value={formData.split_values[index] || ''}
                    onChange={(e) => handleSplitValueChange(e, index)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      formData.split_type === 'percentage' ? 'Enter %' : 'Enter amount'
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              required
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;