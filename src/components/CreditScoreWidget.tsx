import React, { useEffect, useState } from 'react';
import { LineChart, AlertCircle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { format } from 'date-fns';
import type { CreditScore } from '../types';

const CreditScoreWidget: React.FC = () => {
  const { creditScores, fetchCreditScores, updateCreditScore } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCreditScores(); // Fetch credit scores when component mounts with user_id
  }, [fetchCreditScores]);

  const getScoreColor = (score: number) => {
    if (score >= 740) return 'text-green-600';
    if (score >= 670) return 'text-blue-600';
    if (score >= 580) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const score: CreditScore = {
      bureau: formData.get('bureau') as 'TransUnion' | 'Experian' | 'Equifax',
      score: parseInt(formData.get('score') as string, 10),
      last_updated: new Date(),
    };
    await updateCreditScore(score);
    fetchCreditScores();
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LineChart className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Credit Scores</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Update Score
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bureau</label>
              <select
                name="bureau"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="TransUnion">TransUnion</option>
                <option value="Experian">Experian</option>
                <option value="Equifax">Equifax</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Score</label>
              <input
                type="number"
                name="score"
                required
                min="300"
                max="850"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Save Score
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['TransUnion', 'Experian', 'Equifax'].map((bureau) => {
          const scoreData = creditScores.find((s) => s.bureau === bureau);
          return (
            <div
              key={bureau}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <h3 className="text-sm font-medium text-gray-600">{bureau}</h3>
              {scoreData ? (
                <>
                  <p className={`text-3xl font-bold ${getScoreColor(scoreData.score)}`}>
                    {scoreData.score}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {getScoreCategory(scoreData.score)}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Updated: {format(new Date(scoreData.last_updated), 'MMM d, yyyy')}
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No data available</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800">Score Ranges:</h4>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div>
            <span className="text-green-600 font-medium">800-850:</span> Exceptional
          </div>
          <div>
            <span className="text-green-600 font-medium">740-799:</span> Very Good
          </div>
          <div>
            <span className="text-blue-600 font-medium">670-739:</span> Good
          </div>
          <div>
            <span className="text-yellow-600 font-medium">580-669:</span> Fair
          </div>
          <div>
            <span className="text-red-600 font-medium">300-579:</span> Poor
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreWidget;