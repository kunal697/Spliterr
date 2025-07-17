import React, { useState } from "react";
import { motion } from "framer-motion";
import AddExpenseForm  from "../components/AddExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import BalancesView  from "../components/BalancesView";
import { SettlementSummary } from "../components/SettlementSummary";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { Calculator, Users, Receipt, ArrowRightLeft } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Split Expense</h1>
          <p className="text-gray-600">
            Track shared expenses and settle up with friends
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          <button
            className={`flex items-center justify-center gap-2 p-2 border rounded ${activeTab === "expenses" ? "bg-indigo-200" : "bg-white"}`}
            onClick={() => setActiveTab("expenses")}
          >
            <Receipt className="w-4 h-4" /> Expenses
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-2 border rounded ${activeTab === "add" ? "bg-indigo-200" : "bg-white"}`}
            onClick={() => setActiveTab("add")}
          >
            <Calculator className="w-4 h-4" /> Add Expense
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-2 border rounded ${activeTab === "balances" ? "bg-indigo-200" : "bg-white"}`}
            onClick={() => setActiveTab("balances")}
          >
            <Users className="w-4 h-4" /> Balances
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-2 border rounded ${activeTab === "settlements" ? "bg-indigo-200" : "bg-white"}`}
            onClick={() => setActiveTab("settlements")}
          >
            <ArrowRightLeft className="w-4 h-4" /> Settlements
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-2 border rounded ${activeTab === "analytics" ? "bg-indigo-200" : "bg-white"}`}
            onClick={() => setActiveTab("analytics")}
          >
            <Calculator className="w-4 h-4" /> Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {activeTab === "expenses" && (
            <>
              <h2 className="text-2xl font-semibold mb-2">All Expenses</h2>
              <p className="text-gray-500 mb-4">View and manage your shared expenses</p>
              <ExpenseList key={refreshTrigger} onExpenseChange={handleExpenseChange} />
            </>
          )}

          {activeTab === "add" && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Add New Expense</h2>
              <p className="text-gray-500 mb-4">Split a new expense with your friends</p>
              <AddExpenseForm onExpenseAdded={handleExpenseChange} />
            </>
          )}

          {activeTab === "balances" && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Current Balances</h2>
              <p className="text-gray-500 mb-4">See who owes what</p>
              <BalancesView key={refreshTrigger} />
            </>
          )}

          {activeTab === "settlements" && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Settlement Summary</h2>
              <p className="text-gray-500 mb-4">Simplified payment suggestions</p>
              <SettlementSummary key={refreshTrigger} />
            </>
          )}

          {activeTab === "analytics" && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
              <p className="text-gray-500 mb-4">Spending breakdown, trends, and insights</p>
              <AnalyticsDashboard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
