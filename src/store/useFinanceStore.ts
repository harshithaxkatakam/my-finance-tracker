import { create } from 'zustand';
import { Transaction, Card, Loan, SalaryAllocation, CreditScore } from '../types';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';

interface FinanceState {
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  salaryAllocations: SalaryAllocation[];
  monthlySalary: number;
  creditScores: CreditScore[];

  addTransaction: (transaction: Transaction) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addCard: (card: Card) => Promise<void>;
  fetchCards: () => Promise<void>;
  addLoan: (loan: Loan) => Promise<void>;
  fetchLoans: () => Promise<void>;
  updateSalaryAllocation: (allocations: SalaryAllocation[]) => Promise<void>;
  fetchSalaryAllocations: () => Promise<void>;
  setSalary: (amount: number) => Promise<void>;
  fetchCreditScores: () => Promise<void>;
  updateCreditScore: (score: CreditScore) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  cards: [],
  loans: [],
  salaryAllocations: [],
  monthlySalary: 0,
  creditScores: [],

  fetchTransactions: async () => {
    const { user_id } = useUserStore.getState();
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      set({ transactions: data || [] });
    }
  },

  addTransaction: async (transaction) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('transactions').insert([{ ...transaction, user_id: user_id }]);
    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      await useFinanceStore.getState().fetchTransactions();
    }
  },

  fetchCards: async () => {
    const { user_id } = useUserStore.getState();
    const { data, error } = await supabase.from('cards').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching cards:', error);
    } else {
      set({ cards: data || [] });
    }
  },

  addCard: async (card) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('cards').insert([{ ...card, user_id: user_id }]);
    if (error) {
      console.error('Error adding card:', error);
    } else {
      await useFinanceStore.getState().fetchCards();
    }
  },

  fetchLoans: async () => {
    const { user_id } = useUserStore.getState();
    const { data, error } = await supabase.from('loans').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching loans:', error);
    } else {
      set({ loans: data || [] });
    }
  },

  addLoan: async (loan) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('loans').insert([{ ...loan, user_id: user_id }]);
    if (error) {
      console.error('Error adding loan:', error);
    } else {
      await useFinanceStore.getState().fetchLoans();
    }
  },

  fetchSalaryAllocations: async () => {
    const { user_id } = useUserStore.getState();
    const { data, error } = await supabase.from('salary_allocations').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching salary allocations:', error);
    } else {
      set({ salaryAllocations: data || [] });
    }
  },

  updateSalaryAllocation: async (allocations) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('salary_allocations').upsert(allocations.map(a => ({ ...a, user_id: user_id })));
    if (error) {
      console.error('Error updating salary allocation:', error);
    } else {
      await useFinanceStore.getState().fetchSalaryAllocations();
    }
  },

  setSalary: async (amount) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('salary').upsert({ amount, user_id: user_id });
    if (error) {
      console.error('Error updating salary:', error);
    } else {
      set({ monthlySalary: amount });
    }
  },

  fetchCreditScores: async () => {
    const { user_id } = useUserStore.getState();
    const { data, error } = await supabase.from('credit_scores').select('*').eq('user_id', user_id);
    if (error) {
      console.error('Error fetching credit scores:', error);
    } else {
      set({ creditScores: data || [] });
    }
  },

  updateCreditScore: async (score) => {
    const { user_id } = useUserStore.getState();
    const { error } = await supabase.from('credit_scores').upsert({
      bureau: score.bureau,
      score: score.score,
      user_id: user_id,
      last_updated: new Date().toISOString(),
    },
      { onConflict: 'user_id,bureau' }
    );

    if (error) {
      console.error('Error updating credit score:', error);
    } else {
      await useFinanceStore.getState().fetchCreditScores();
    }
  },
}));