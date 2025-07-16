// context/ExpenseContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { api } from '../api/index.js';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  people: [],
  balances: {},
  settlements: [],
  loading: false,
  error: null
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

  return (
    <ExpenseContext.Provider value={{
      ...state,
      fetchExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      fetchPeople,
      fetchBalances,
      fetchSettlements
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