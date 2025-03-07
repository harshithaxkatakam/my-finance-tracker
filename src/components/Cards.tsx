import React, { useEffect, useState } from 'react';
import { PlusCircle, CreditCard, Wallet, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card, Loan } from '../types';
import { format } from 'date-fns';

const Cards: React.FC = () => {
  const { cards, loans, transactions } = useFinanceStore((state) => ({
    cards: state.cards,
    loans: state.loans,
    transactions: state.transactions,
  }));

  const { fetchCards, fetchLoans, fetchTransactions } = useFinanceStore();
  const addCard = useFinanceStore((state) => state.addCard);
  const addLoan = useFinanceStore((state) => state.addLoan);

  const [showCardForm, setShowCardForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchLoans();
    fetchTransactions();
  }, []);

  // Calculate usage percentage for credit cards
  const getUsagePercentage = (card: Card) => {
    if (card.type !== 'credit' || !card.credit_limit) return 0;

    const totalSpent = transactions
      .filter((txn) => txn.cardId === card.id && txn.amount < 0) // Outgoing transactions only
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

    return ((totalSpent / card.credit_limit) * 100).toFixed(1);
  };

  // Handle adding a new card
  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const card: Card = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'credit' | 'debit',
      last_four_digits: formData.get('last_four_digits') as string,
      due_date: parseInt(formData.get('due_date') as string),
      credit_limit: formData.get('type') === 'credit' ? parseFloat(formData.get('credit_limit') as string) : undefined,
      allowed_percentage: formData.get('allowed_percentage') ? parseFloat(formData.get('allowed_percentage') as string) : undefined,
    };
    addCard(card);
    setShowCardForm(false);
  };

  // Handle adding a new loan
  const handleAddLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const loan: Loan = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      total_amount: parseFloat(formData.get('total_amount') as string),
      remaining_amount: parseFloat(formData.get('total_amount') as string), // Initially, remaining = total
      emi_amount: parseFloat(formData.get('emi_amount') as string),
      due_date: parseInt(formData.get('due_date') as string),
      start_date: new Date(formData.get('start_date') as string),
      end_date: new Date(formData.get('end_date') as string),
    };
    addLoan(loan);
    setShowLoanForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Cards Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Cards</h2>
          <button
            onClick={() => setShowCardForm(true)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
          >
            <PlusCircle size={20} />
            <span>Add Card</span>
          </button>
        </div>

        {showCardForm && (
          <form onSubmit={handleAddCard} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last 4 Digits</label>
                <input type="text" name="last_four_digits" required pattern="[0-9]{4}" maxLength={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="number" name="due_date" min="1" max="31" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                <input type="number" name="credit_limit" min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Allowed Usage (%)</label>
                <input type="number" name="allowed_percentage" min="0" max="100" step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setShowCardForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md">Add Card</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const usagePercentage = getUsagePercentage(card);
            const isOverLimit = card.allowed_percentage !== undefined && Number(usagePercentage) > card.allowed_percentage;

            return (
              <div key={card.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center space-x-3">
                  {card.type === 'credit' ? <CreditCard className="text-indigo-600" size={24} /> : <Wallet className="text-green-600" size={24} />}
                  <div>
                    <h3 className="font-medium text-gray-900">{card.name}</h3>
                    <p className="text-sm text-gray-500">**** **** **** {card.last_four_digits}</p>
                  </div>
                </div>
                {card.type === 'credit' && card.credit_limit && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Credit Limit: ${card.credit_limit.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Allowed Usage: {card.allowed_percentage || 0}%</p>
                    <p className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
                      Used: {usagePercentage}%
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className={`h-2 rounded-full ${isOverLimit ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${usagePercentage}%` }} />
                    </div>

                    {isOverLimit && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle size={16} className="mr-1" /> Exceeds Allowed Limit!
                      </p>
                    )}
                  </div>
                )}
              </div>)

          })}
        </div>
        {/* Loans Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Loans & EMIs</h2>
            <button
              onClick={() => setShowLoanForm(true)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
            >
              <PlusCircle size={20} />
              <span>Add Loan</span>
            </button>
          </div>

          {showLoanForm && (
            <form onSubmit={handleAddLoan} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    name="total_amount"
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">EMI Amount</label>
                  <input
                    type="number"
                    name="emi_amount"
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="number"
                    name="due_date"
                    min="1"
                    max="31"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLoanForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Add Loan
                </button>
              </div>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h3 className="font-medium text-gray-900">{loan.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Total Amount: ${loan.total_amount.toLocaleString()}</p>
                  <p>Remaining: ${loan.remaining_amount.toLocaleString()}</p>
                  <p>EMI Amount: ${loan.emi_amount.toLocaleString()}</p>
                  <p>Due Date: {loan.due_date}</p>
                  <p>Period: {format(loan.start_date, 'MMM yyyy')} - {format(loan.end_date, 'MMM yyyy')}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Cards;
