import { create } from 'zustand';
import { Transaction, Card, Loan, SalaryAllocation, CreditScore } from '../types';
import { supabase } from '../lib/supabase';

interface FinanceState {
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  salaryAllocations: SalaryAllocation[];
  monthlySalary: number;
  creditScores: CreditScore[];

  addTransaction: (transaction: Transaction, user_id: string) => Promise<void>;
  fetchTransactions: (user_id: string) => Promise<void>;
  addCard: (card: Card, user_id: string) => Promise<void>;
  fetchCards: (user_id: string) => Promise<void>;
  addLoan: (loan: Loan, user_id: string) => Promise<void>;
  fetchLoans: (user_id: string) => Promise<void>;
  updateSalaryAllocation: (allocations: SalaryAllocation[], user_id: string) => Promise<void>;
  fetchSalaryAllocations: (user_id: string) => Promise<void>;
  setSalary: (amount: number, user_id: string) => Promise<void>;
  fetchCreditScores: (user_id: string) => Promise<void>;
  updateCreditScore: (score: CreditScore, user_id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  cards: [],
  loans: [],
  salaryAllocations: [],
  monthlySalary: 0,
  creditScores: [],

  fetchTransactions: async (user_id) => {
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      set({ transactions: data || [] });
    }
  },

  addTransaction: async (transaction, user_id) => {
    const { error } = await supabase.from('transactions').insert([{ ...transaction, user_id: user_id }]);
    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      await useFinanceStore.getState().fetchTransactions(user_id);
    }
  },

  fetchCards: async (user_id) => {
    const { data, error } = await supabase.from('cards').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching cards:', error);
    } else {
      set({ cards: data || [] });
    }
  },

  addCard: async (card, user_id) => {
    const { error } = await supabase.from('cards').insert([{ ...card, user_id: user_id }]);
    if (error) {
      console.error('Error adding card:', error);
    } else {
      await useFinanceStore.getState().fetchCards(user_id);
    }
  },

  fetchLoans: async (user_id) => {
    const { data, error } = await supabase.from('loans').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching loans:', error);
    } else {
      set({ loans: data || [] });
    }
  },

  addLoan: async (loan, user_id) => {
    const { error } = await supabase.from('loans').insert([{ ...loan, user_id: user_id }]);
    if (error) {
      console.error('Error adding loan:', error);
    } else {
      await useFinanceStore.getState().fetchLoans(user_id);
    }
  },

  fetchSalaryAllocations: async (user_id) => {
    const { data, error } = await supabase.from('salary_allocations').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching salary allocations:', error);
    } else {
      set({ salaryAllocations: data || [] });
    }
  },

  updateSalaryAllocation: async (allocations, user_id) => {
    const { error } = await supabase.from('salary_allocations').upsert(allocations.map(a => ({ ...a, user_id: user_id })));
    if (error) {
      console.error('Error updating salary allocation:', error);
    } else {
      await useFinanceStore.getState().fetchSalaryAllocations(user_id);
    }
  },

  setSalary: async (amount, user_id) => {
    const { error } = await supabase.from('salary').upsert({ amount, user_id: user_id });
    if (error) {
      console.error('Error updating salary:', error);
    } else {
      set({ monthlySalary: amount });
    }
  },

  fetchCreditScores: async (user_id) => {
    const { data, error } = await supabase.from('credit_scores').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching credit scores:', error);
    } else {
      set({ creditScores: data || [] });
    }
  },

  updateCreditScore: async (score, user_id) => {
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    const { error } = await supabase.from('credit_scores').upsert({
      bureau: score.bureau,
      score: score.score,
      user_id: "9288b8a0-bb4b-406a-a450-89040b10e269",
      last_updated: new Date().toISOString(),
    },
      { onConflict: 'user_id,bureau' }
    );

    if (error) {
      console.error('Error updating credit score:', error);
    } else {
      await useFinanceStore.getState().fetchCreditScores(user_id);
    }
  },
}));