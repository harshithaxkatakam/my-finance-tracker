import React, { useState } from 'react';
import { PlusCircle, CreditCard, Wallet } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card, Loan } from '../types';
import { format } from 'date-fns';

const Cards: React.FC = () => {
  const { cards, loans } = useFinanceStore((state) => ({
    cards: state.cards,
    loans: state.loans,
  }));
  const addCard = useFinanceStore((state) => state.addCard);
  const addLoan = useFinanceStore((state) => state.addLoan);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const card: Card = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'credit' | 'debit',
      lastFourDigits: formData.get('lastFourDigits') as string,
      dueDate: parseInt(formData.get('dueDate') as string),
      creditLimit: formData.get('type') === 'credit' ? parseFloat(formData.get('creditLimit') as string) : undefined,
    };
    addCard(card);
    setShowCardForm(false);
  };

  const handleAddLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const loan: Loan = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      remainingAmount: parseFloat(formData.get('totalAmount') as string),
      emiAmount: parseFloat(formData.get('emiAmount') as string),
      dueDate: parseInt(formData.get('dueDate') as string),
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
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
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last 4 Digits</label>
                <input
                  type="text"
                  name="lastFourDigits"
                  required
                  pattern="[0-9]{4}"
                  maxLength={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="number"
                  name="dueDate"
                  min="1"
                  max="31"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                <input
                  type="number"
                  name="creditLimit"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCardForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Add Card
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                {card.type === 'credit' ? (
                  <CreditCard className="text-indigo-600" size={24} />
                ) : (
                  <Wallet className="text-green-600" size={24} />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{card.name}</h3>
                  <p className="text-sm text-gray-500">
                    **** **** **** {card.lastFourDigits}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Due Date: {card.dueDate}</p>
                {card.type === 'credit' && card.creditLimit && (
                  <p>Credit Limit: ${card.creditLimit.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
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
                  name="totalAmount"
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
                  name="emiAmount"
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
                  name="dueDate"
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
                  name="startDate"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
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
                <p>Total Amount: ${loan.totalAmount.toLocaleString()}</p>
                <p>Remaining: ${loan.remainingAmount.toLocaleString()}</p>
                <p>EMI Amount: ${loan.emiAmount.toLocaleString()}</p>
                <p>Due Date: {loan.dueDate}</p>
                <p>Period: {format(loan.startDate, 'MMM yyyy')} - {format(loan.endDate, 'MMM yyyy')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;