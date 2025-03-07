import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, TransactionCategory } from '../types';

const StatementUpload: React.FC = () => {
  const addTransactions = useFinanceStore((state) => state.addTransactions);

  const categorizeTransaction = (description: string): TransactionCategory => {
    description = description.toLowerCase();
    
    if (description.includes('restaurant') || description.includes('food')) return 'food';
    if (description.includes('grocery') || description.includes('supermarket')) return 'grocery';
    if (description.includes('uber') || description.includes('train') || description.includes('flight')) return 'travel';
    if (description.includes('emi') || description.includes('loan')) return 'emi';
    if (description.includes('amazon') || description.includes('shopping')) return 'shopping';
    if (description.includes('bill') || description.includes('utility')) return 'bills';
    
    return 'other';
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        complete: (results) => {
          const transactions: Transaction[] = results.data
            .slice(1) // Skip header row
            .map((row: any) => ({
              id: crypto.randomUUID(),
              date: new Date(row[0]),
              description: row[1],
              amount: parseFloat(row[2]),
              category: categorizeTransaction(row[1]),
            }))
            .filter((t: Transaction) => !isNaN(t.amount));

          addTransactions(transactions);
          toast.success(`Imported ${transactions.length} transactions`);
        },
        error: () => {
          toast.error('Error parsing the statement file');
        },
      });
    });
  }, [addTransactions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Drop your statement here'
          : 'Drag & drop your bank statement, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">Supports CSV format</p>
    </div>
  );
};

export default StatementUpload;