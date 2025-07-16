import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useExpense } from "../contexts/ExpenseContext";
import LoadingSpinner from "./LoadingSpinner";

export function SettlementSummary() {
  const {
    settlements = [],
    loading = false,
    fetchSettlements,
  } = useExpense();

  useEffect(() => {
    fetchSettlements();
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) return <LoadingSpinner />;

  if (!settlements || settlements.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All settled up!</h3>
        <p className="text-gray-500">No payments needed at the moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {settlements.map((settlement, index) => (
        <motion.div
          key={`${settlement.from}-${settlement.to}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center justify-between"
        >
          {/* Sender */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
              {getInitials(settlement.from)}
            </div>
            <div className="text-sm">
              <div className="font-medium">{settlement.from}</div>
              <div className="text-gray-500 text-xs">pays</div>
            </div>
          </div>

          {/* Arrow + Amount */}
          <div className="flex flex-col items-center text-sm font-semibold text-blue-600">
            <ArrowRight className="w-4 h-4" />
            ₹{settlement.amount.toFixed(2)}
          </div>

          {/* Receiver */}
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="font-medium">{settlement.to}</div>
              <div className="text-gray-500 text-xs">receives</div>
            </div>
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
              {getInitials(settlement.to)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
