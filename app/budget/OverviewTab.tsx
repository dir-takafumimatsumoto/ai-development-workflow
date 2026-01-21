'use client';

import { useState } from 'react';
import type { Transaction, MonthlySummary } from './types';
import { CATEGORIES } from './data';

interface OverviewTabProps {
  summary: MonthlySummary;
  currentMonth: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function OverviewTab({ summary, currentMonth, onAddTransaction }: OverviewTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    onAddTransaction({
      type,
      amount: parseInt(amount) || 0,
      date,
      category,
      description
    });

    // Reset form
    setAmount('0');
    setCategory('');
    setDescription('');
    setIsFormOpen(false);
  };

  const categories = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center">{currentMonth}の収支</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">収入</span>
            <span className="text-green-500">↗</span>
          </div>
          <div className="text-3xl font-bold text-green-600">¥{summary.income.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">0件の取引</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">支出</span>
            <span className="text-red-500">↘</span>
          </div>
          <div className="text-3xl font-bold text-red-600">¥{summary.expense.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">1件の取引</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">収支</span>
            <span className="text-gray-400">💰</span>
          </div>
          <div className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.balance >= 0 ? '' : '-'}¥{Math.abs(summary.balance).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">前半</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full py-3 text-left flex items-center gap-2 text-gray-700 hover:bg-gray-50 rounded"
          >
            <span className="text-xl">+</span>
            <span>新しい取引を追加</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xl">+</span>
              <span className="font-medium">新しい取引を追加</span>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">取引種類</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={(e) => {
                      setType('income');
                      setCategory('');
                    }}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-green-600">収入</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={(e) => {
                      setType('expense');
                      setCategory('');
                    }}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-red-600">支出</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">金額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              >
                <option value="">カテゴリを選択してください</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">説明（任意）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細を入力してください"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              追加
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
