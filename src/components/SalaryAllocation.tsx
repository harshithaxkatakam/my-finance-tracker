import React, { useState, useEffect } from 'react';
import { PieChart, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SalaryAllocation as SalaryAllocationType } from '../types';

const SalaryAllocation: React.FC = () => {
  const { monthlySalary, salaryAllocations } = useFinanceStore((state) => ({
    monthlySalary: state.monthlySalary,
    salaryAllocations: state.salaryAllocations,
  }));
  const updateSalaryAllocation = useFinanceStore((state) => state.updateSalaryAllocation);
  const setSalary = useFinanceStore((state) => state.setSalary);

  const [allocations, setAllocations] = useState<SalaryAllocationType[]>(salaryAllocations);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    setAllocations(salaryAllocations);
  }, [salaryAllocations]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSalary(isNaN(value) ? 0 : value);
  };

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;

    const amount = parseFloat(newAmount);
    if (isNaN(amount)) return;

    const newAllocation: SalaryAllocationType = {
      id: crypto.randomUUID(),
      category: newCategory,
      amount,
      percentage: (amount / monthlySalary) * 100,
    };

    const updatedAllocations = [...allocations, newAllocation];
    updateSalaryAllocation(updatedAllocations);
    setNewCategory('');
    setNewAmount('');
  };

  const removeAllocation = (id: string) => {
    const updatedAllocations = allocations.filter((a) => a.id !== id);
    updateSalaryAllocation(updatedAllocations);
  };

  const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);
  const remaining = monthlySalary - totalAllocated;

  return (
    <div className="space-y-6">
      {/* Salary Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <DollarSign className="text-green-600" size={24} />
          <div className="flex-1">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Monthly Salary
            </label>
            <input
              type="number"
              id="salary"
              value={monthlySalary || ''}
              onChange={handleSalaryChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your monthly salary"
            />
          </div>
        </div>
      </div>

      {/* Add Allocation Form */}
      <form onSubmit={handleAddAllocation} className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="e.g., Rent, Utilities"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Allocation
            </button>
          </div>
        </div>
      </form>

      {/* Allocations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Salary Allocations</h3>
          <div className="mt-4 space-y-4">
            {allocations.map((allocation) => (
              <div
                key={allocation.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{allocation.category}</h4>
                  <p className="text-sm text-gray-500">
                    ${allocation.amount.toLocaleString()} ({allocation.percentage.toFixed(1)}%)
                  </p>
                </div>
                <button
                  onClick={() => removeAllocation(allocation.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Allocated</p>
                <p className="text-lg font-medium text-gray-900">
                  ${totalAllocated.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className={`text-lg font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remaining.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryAllocation;