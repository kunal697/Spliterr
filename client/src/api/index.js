// api/index.js
const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async getAllExpenses() {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  
  async addExpense(expense) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add expense');
      return await data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },
  
  async updateExpense(id, expense) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update expense');
      return await data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },
  
  async deleteExpense(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      return await response.json();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
  
  async getAllPeople() {
    try {
      const response = await fetch(`${API_BASE_URL}/settlements/people`);
      if (!response.ok) throw new Error('Failed to fetch people');
      return await response.json();
    } catch (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
  },
  
  async getBalances() {
    try {
      const response = await fetch(`${API_BASE_URL}/settlements/balances`);
      if (!response.ok) throw new Error('Failed to fetch balances');
      return await response.json();
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw error;
    }
  },
  
  async getSettlements() {
    try {
      const response = await fetch(`${API_BASE_URL}/settlements`);
      if (!response.ok) throw new Error('Failed to fetch settlements');
      return await response.json();
    } catch (error) {
      console.error('Error fetching settlements:', error);
      throw error;
    }
  }
};