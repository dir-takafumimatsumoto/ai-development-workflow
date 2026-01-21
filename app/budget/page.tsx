'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from './types';
import {
  getTransactionsByMonth,
  calculateMonthlySummary,
  calculateCategoryBreakdown,
  addTransaction,
  updateTransaction as updateTransactionData,
  deleteTransaction as deleteTransactionData
} from './data';
import OverviewTab from './OverviewTab';
import HistoryTab from './HistoryTab';
import BreakdownTab from './BreakdownTab';

type Tab = 'overview' | 'history' | 'breakdown';

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTransactions();
  }, [currentYear, currentMonth]);

  const loadTransactions = () => {
    const data = getTransactionsByMonth(currentYear, currentMonth);
    setTransactions(data);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    loadTransactions();
  };

  const handleUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    updateTransactionData(id, updates);
    loadTransactions();
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('この取引を削除してもよろしいですか?')) {
      deleteTransactionData(id);
      loadTransactions();
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  const summary = calculateMonthlySummary(transactions);
  const incomeBreakdown = calculateCategoryBreakdown(transactions, 'income');
  const expenseBreakdown = calculateCategoryBreakdown(transactions, 'expense');
  const currentMonthText = `${currentYear}年${currentMonth}月`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold">家計簿アプリ</h1>
          </div>
          <p className="text-gray-600 text-sm">収入と支出を記録して、家計を管理しましょう</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white border-t-2 border-x border-black text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📈 概要
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-white border-t-2 border-x border-black text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ≡ 取引履歴
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                activeTab === 'breakdown'
                  ? 'bg-white border-t-2 border-x border-black text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⏱ カテゴリ内訳
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            currentMonth={currentMonthText}
            onAddTransaction={handleAddTransaction}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab
            transactions={transactions}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
        {activeTab === 'breakdown' && (
          <BreakdownTab
            incomeBreakdown={incomeBreakdown}
            expenseBreakdown={expenseBreakdown}
          />
        )}
      </div>
    </div>
  );
}
