import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, TransactionCategory } from '../types';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

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

  const processPDF = async (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      if (!reader.result) return;
      GlobalWorkerOptions.workerSrc = pdfWorker;
      const pdf = await getDocument({ data: reader.result }).promise;
      let textContent = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items
          .filter((item): item is TextItem => 'str' in item)
          .map(item => item.str.trim())
          .join(' ') + '\n';
      }

      console.log('Extracted PDF Text:', textContent);

      // 🔹 Parse Transactions from Extracted Text
      const transactions: Transaction[] = [];
      const lines = textContent.split('\n');

      lines.forEach((line, index) => {
        // 🔹 Updated regex to handle missing transactions and extra spacing issues
        const parts = line.match(/(\d{2}\/\d{2})\s+(.+?)\s+(-?\$?\d{1,3}(?:,\d{3})*\.\d{2})/);

        if (parts) {
          let rawDate = parts[1]; // Extract MM/DD format
          let description = parts[2].trim(); // Extract transaction description
          let amountString = parts[3].replace(/[^0-9.-]+/g, ''); // Clean amount format
          let amount = parseFloat(amountString);

          // Check if the next line is part of the description (fixing broken merchant names)
          if (lines[index + 1] && !lines[index + 1].match(/\$\d/)) {
            description += ' ' + lines[index + 1].trim();
          }

          if (!isNaN(amount)) { // Ensure amount is valid
            const currentYear = new Date().getFullYear();
            const formattedDate = new Date(`${currentYear}-${rawDate.split('/')[0]}-${rawDate.split('/')[1]}`);

            if (!isNaN(formattedDate.getTime())) { // Validate date
              transactions.push({
                id: crypto.randomUUID(),
                date: formattedDate.toISOString(), // Store date in ISO format
                description,
                amount,
                category: categorizeTransaction(description),
              });
            } else {
              console.warn(`Skipping invalid date: ${rawDate}`);
            }
          }
        }
      });

      if (transactions.length > 0) {
        addTransactions(transactions);
        toast.success(`Imported ${transactions.length} transactions from PDF`);
      } else {
        toast.error('No valid transactions found in PDF');
      }
    };
  };


  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type === 'text/csv') {
        Papa.parse(file, {
          complete: (results) => {
            const transactions: Transaction[] = results.data
              .slice(1) // Skip header row
              .map((row: any) => ({
                id: crypto.randomUUID(),
                date: new Date(row[0]).toISOString(),
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
      } else if (file.type === 'application/pdf') {
        processPDF(file);
      } else {
        toast.error('Unsupported file format');
      }
    });
  }, [addTransactions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Drop your statement here'
          : 'Drag & drop your bank statement, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">Supports CSV and PDF formats</p>
    </div>
  );
};

export default StatementUpload;
