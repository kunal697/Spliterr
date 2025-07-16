import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useExpense } from '../contexts/ExpenseContext';
import LoadingSpinner from './LoadingSpinner';
import { IndianRupee } from 'lucide-react';

const BalancesView = () => {
  const { balances, fetchBalances, loading } = useExpense();

  useEffect(() => {
    fetchBalances();
  }, []);

  if (loading) return <LoadingSpinner />;

  const balanceEntries = Object.entries(balances);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-10"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Balances</h2>
        <p className="text-gray-500 text-sm">Who owes what</p>
      </div>

      {balanceEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-gray-500 text-base">No balances to display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {balanceEntries.map(([person, amount]) => {
            const isPositive = amount > 0;
            const isNegative = amount < 0;
            const status = isPositive ? 'is owed' : isNegative ? 'owes' : 'settled up';
            const textColor = isPositive
              ? 'text-green-600'
              : isNegative
              ? 'text-red-600'
              : 'text-gray-500';

            return (
              <div
                key={person}
                className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${textColor}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                    {person.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800 text-lg">{person}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className={`text-xl font-semibold ${textColor} flex items-center gap-1`}>
                    <IndianRupee className="w-4 h-4" />
                    {Math.abs(amount).toFixed(2)}
                  </div>
                  <span className={`text-sm font-medium ${textColor}`}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default BalancesView;
