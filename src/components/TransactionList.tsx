import React from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '../store/useFinanceStore';

const TransactionList: React.FC = () => {
  const transactions = useFinanceStore((state) => state.transactions);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-red-100 text-red-800',
      grocery: 'bg-green-100 text-green-800',
      travel: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      shopping: 'bg-yellow-100 text-yellow-800',
      bills: 'bg-gray-100 text-gray-800',
      loan: 'bg-orange-100 text-orange-800',
      emi: 'bg-pink-100 text-pink-800',
      transfer: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(transaction.date, 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;