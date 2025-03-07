import React, { useEffect, useState } from 'react';
import { Wallet, CreditCard, PieChart, Upload, Bell, LineChart, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import StatementUpload from './components/StatementUpload';
import TransactionList from './components/TransactionList';
import Cards from './components/Cards';
import SalaryAllocation from './components/SalaryAllocation';
import CreditScoreWidget from './components/CreditScoreWidget';

function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = React.useState('transactions');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-white hover:text-gray-200"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CreditScoreWidget />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'transactions'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Wallet size={20} />
              <span>Transactions</span>
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'cards'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCard size={20} />
              <span>Cards & Loans</span>
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'allocation'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChart size={20} />
              <span>Salary Allocation</span>
            </button>
          </div>

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <StatementUpload />
              <TransactionList />
            </div>
          )}
          
          {activeTab === 'cards' && <Cards />}
          
          {activeTab === 'allocation' && <SalaryAllocation />}
        </div>
      </main>
    </div>
  );
}

export default App;