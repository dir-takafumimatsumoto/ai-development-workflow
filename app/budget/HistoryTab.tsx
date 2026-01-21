'use client';

import { useState } from 'react';
import type { Transaction } from './types';
import { CATEGORIES } from './data';

interface HistoryTabProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function HistoryTab({ transactions, onUpdateTransaction, onDeleteTransaction }: HistoryTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  const handleSave = () => {
    if (editForm && editingId) {
      onUpdateTransaction(editingId, {
        type: editForm.type,
        amount: editForm.amount,
        date: editForm.date,
        category: editForm.category,
        description: editForm.description
      });
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">取引履歴</h2>

      {sortedTransactions.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center text-gray-500">
          取引履歴がありません
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTransactions.map((transaction) => {
            const isEditing = editingId === transaction.id;
            const categories = transaction.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

            return (
              <div key={transaction.id} className="bg-white rounded-lg p-4 shadow-sm border">
                {isEditing && editForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">取引種類</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`type-${transaction.id}`}
                            value="income"
                            checked={editForm.type === 'income'}
                            onChange={() => setEditForm({ ...editForm, type: 'income', category: '' })}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-green-600">収入</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`type-${transaction.id}`}
                            value="expense"
                            checked={editForm.type === 'expense'}
                            onChange={() => setEditForm({ ...editForm, type: 'expense', category: '' })}
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
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) || 0 })}
                            className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        <option value="">カテゴリを選択してください</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '↗' : '↘'} {transaction.type === 'expense' ? '-' : '+'}¥{transaction.amount.toLocaleString()}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{new Date(transaction.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        {transaction.description && <span>{transaction.description}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        aria-label="編集"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="削除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
