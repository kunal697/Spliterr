import React, { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useExpense } from '../contexts/ExpenseContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function AnalyticsDashboard() {
  const {
    analytics,
    fetchAnalytics,
    loading,
    error,
  } = useExpense();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle the nested data structure properly
  const analyticsData = analytics?.data || analytics || {};
  const {
    monthly = [],
    categorySummary = [],
    topCategories = [],
    topTransactions = [],
  } = analyticsData;

  // Format monthly data for better display
  const formatMonthlyData = (data) => {
    return data.map(item => ({
      ...item,
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    }));
  };

  const formattedMonthly = formatMonthlyData(monthly);

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      {loading && <p className="text-blue-500">Loading analytics...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Monthly Expense Bar Chart */}
      <div className="bg-white shadow rounded p-4 border">
        <h3 className="text-lg font-semibold mb-2">Monthly Expense</h3>
        {formattedMonthly.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedMonthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Total']} />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No monthly data available.</p>
        )}
      </div>

      {/* Category Summary Pie Chart */}
      <div className="bg-white shadow rounded p-4 border">
        <h3 className="text-lg font-semibold mb-2">Category Summary</h3>
        {categorySummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySummary}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, total }) => `${category}: ₹${total}`}
              >
                {categorySummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Total']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No category summary available.</p>
        )}
      </div>

      {/* Top Categories Bar Chart */}
      <div className="bg-white shadow rounded p-4 border">
        <h3 className="text-lg font-semibold mb-2">Top Categories</h3>
        {topCategories.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Total']} />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No top categories available.</p>
        )}
      </div>

      {/* Top Transactions Table */}
      <div className="bg-white shadow rounded p-4 border">
        <h3 className="text-lg font-semibold mb-2">Top Transactions</h3>
        {topTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border-b">Description</th>
                  <th className="p-2 border-b">Amount</th>
                  <th className="p-2 border-b">Category</th>
                  <th className="p-2 border-b">Paid By</th>
                  <th className="p-2 border-b">Shared With</th>
                  <th className="p-2 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {topTransactions.map(tx => (
                  <tr key={tx._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{tx.description}</td>
                    <td className="p-2 font-medium">₹{tx.amount}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-2">{tx.paid_by}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {tx.shared_with.map((person, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {person}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No top transactions available.</p>
        )}
      </div>
    </div>
  );
}