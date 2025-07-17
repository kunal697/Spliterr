// contexts/ExpenseContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { api } from '../api/index.js';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  people: [],
  balances: {},
  settlements: [],
  loading: false,
  error: null,
  analytics: {},
  recurringExpenses: [],
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp =>
          exp._id === action.payload._id ? action.payload : exp
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(exp => exp._id !== action.payload)
      };
    case 'SET_PEOPLE':
      return { ...state, people: action.payload };
    case 'SET_BALANCES':
      return { ...state, balances: action.payload };
    case 'SET_SETTLEMENTS':
      return { ...state, settlements: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'SET_RECURRING_EXPENSES':
      return { ...state, recurringExpenses: action.payload };
    case 'ADD_RECURRING_EXPENSE':
      return { ...state, recurringExpenses: [...state.recurringExpenses, action.payload] };
    case 'UPDATE_RECURRING_EXPENSE':
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.map(exp =>
          exp._id === action.payload._id ? action.payload : exp
        )
      };
    case 'DELETE_RECURRING_EXPENSE':
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.filter(exp => exp._id !== action.payload)
      };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await api.getAllExpenses();
      dispatch({ type: 'SET_EXPENSES', payload: result.data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addExpense = async (expense) => {
    try {
      const result = await api.addExpense(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: result.data });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateExpense = async (id, expense) => {
    try {
      const result = await api.updateExpense(id, expense);
      dispatch({ type: 'UPDATE_EXPENSE', payload: result.data });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchPeople = async () => {
    try {
      const result = await api.getAllPeople();
      dispatch({ type: 'SET_PEOPLE', payload: result.data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchBalances = async () => {
    try {
      const result = await api.getBalances();
      dispatch({ type: 'SET_BALANCES', payload: result.data || {} });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchSettlements = async () => {
    try {
      const result = await api.getSettlements();
      dispatch({ type: 'SET_SETTLEMENTS', payload: result.data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchAnalytics = async () => {
    try {
      const result = await api.getAnalytics();
      dispatch({ type: 'SET_ANALYTICS', payload: result.data || {} });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };


  const fetchRecurringExpenses = async () => {
    try {
      const result = await api.getRecurringExpenses();
      dispatch({ type: 'SET_RECURRING_EXPENSES', payload: result.data || [] });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const addRecurringExpense = async (expense) => {
    try {
      const result = await api.addRecurringExpense(expense);
      dispatch({ type: 'ADD_RECURRING_EXPENSE', payload: result.data });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateRecurringExpense = async (id, expense) => {
    try {
      const result = await api.updateRecurringExpense(id, expense);
      dispatch({ type: 'UPDATE_RECURRING_EXPENSE', payload: result.data });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteRecurringExpense = async (id) => {
    try {
      await api.deleteRecurringExpense(id);
      dispatch({ type: 'DELETE_RECURRING_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider value={{
      ...state,
      fetchExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      fetchPeople,
      fetchBalances,
      fetchSettlements,
      fetchAnalytics,
      fetchRecurringExpenses,
      addRecurringExpense,
      updateRecurringExpense,
      deleteRecurringExpense,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};