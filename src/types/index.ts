export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: TransactionCategory;
  cardId?: string;
}

export type TransactionCategory =
  | 'food'
  | 'grocery'
  | 'travel'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'loan'
  | 'emi'
  | 'transfer'
  | 'other';

export interface Card {
  id: string;
  name: string;
  type: 'credit' | 'debit';
  lastFourDigits: string;
  dueDate?: number;
  creditLimit?: number;
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  emiAmount: number;
  dueDate: number;
  startDate: Date;
  endDate: Date;
}

export interface SalaryAllocation {
  id: string;
  category: string;
  amount: number;
  percentage: number;
}

export interface CreditScore {
  bureau: 'TransUnion' | 'Experian' | 'Equifax';
  score: number;
  lastUpdated: Date;
}