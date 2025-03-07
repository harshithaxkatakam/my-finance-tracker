import { create } from 'zustand';
import { Transaction, Card, Loan, SalaryAllocation, CreditScore } from '../types';

interface FinanceState {
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  salaryAllocations: SalaryAllocation[];
  monthlySalary: number;
  creditScores: CreditScore[];
  
  addTransaction: (transaction: Transaction) => void;
  addTransactions: (transactions: Transaction[]) => void;
  addCard: (card: Card) => void;
  addLoan: (loan: Loan) => void;
  updateSalaryAllocation: (allocations: SalaryAllocation[]) => void;
  setSalary: (amount: number) => void;
  updateCreditScore: (score: CreditScore) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  cards: [],
  loans: [],
  salaryAllocations: [],
  monthlySalary: 0,
  creditScores: [],

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),

  addTransactions: (transactions) =>
    set((state) => ({
      transactions: [...state.transactions, ...transactions],
    })),

  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),

  addLoan: (loan) =>
    set((state) => ({
      loans: [...state.loans, loan],
    })),

  updateSalaryAllocation: (allocations) =>
    set(() => ({
      salaryAllocations: allocations,
    })),

  setSalary: (amount) =>
    set(() => ({
      monthlySalary: amount,
    })),

  updateCreditScore: (score) =>
    set((state) => ({
      creditScores: [
        ...state.creditScores.filter((s) => s.bureau !== score.bureau),
        score,
      ],
    })),
}));