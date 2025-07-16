import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';
import { useExpense } from '../contexts/ExpenseContext';
import toast from 'react-hot-toast';

const AddExpenseForm = () => {
  const {
    addExpense,
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

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

      await addExpense(expenseData);

      setFormData({
        amount: '',
        description: '',
        paid_by: '',
        shared_with: [],
        split_type: 'equal',
        split_values: [],
      });

      fetchExpenses();
      fetchBalances();
      fetchSettlements();
      toast.success("Expense added successfully");
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const showSplitInputs =
    formData.split_type !== 'equal' && formData.shared_with.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h2>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
