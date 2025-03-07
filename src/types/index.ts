export interface Transaction {
  id: string;
  date: string;
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
  last_four_digits: string;
  due_date?: number;
  credit_limit?: number;
  usage_percentage?: number;
  allowed_percentage?: number;
}

export interface Loan {
  id: string;
  name: string;
  total_amount: number;
  remaining_amount: number;
  emi_amount: number;
  due_date: number;
  start_date: Date;
  end_date: Date;
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
  last_updated: Date;
}