'use client';

import type { CategoryBreakdown } from './types';

interface BreakdownTabProps {
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
}

const PIE_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
];

function PieChart({ data, colors }: { data: CategoryBreakdown[]; colors: string[] }) {
  if (data.length === 0) {
    return (
      <div className="w-64 h-64 flex items-center justify-center text-gray-400">
        データなし
      </div>
    );
  }

  let currentAngle = -90;
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <svg viewBox="0 0 200 200" className="w-64 h-64">
      {data.map((item, index) => {
        const percentage = (item.amount / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        const startX = 100 + 90 * Math.cos((startAngle * Math.PI) / 180);
        const startY = 100 + 90 * Math.sin((startAngle * Math.PI) / 180);
        const endX = 100 + 90 * Math.cos((endAngle * Math.PI) / 180);
        const endY = 100 + 90 * Math.sin((endAngle * Math.PI) / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
          `M 100 100`,
          `L ${startX} ${startY}`,
          `A 90 90 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          `Z`
        ].join(' ');

        currentAngle = endAngle;

        return (
          <path
            key={index}
            d={pathData}
            fill={colors[index % colors.length]}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

function Legend({ data, colors }: { data: CategoryBreakdown[]; colors: string[] }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span className="text-sm flex-1">{item.category}</span>
          <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
          <span className="text-sm text-gray-500">({item.percentage.toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}

export default function BreakdownTab({ incomeBreakdown, expenseBreakdown }: BreakdownTabProps) {
  const incomeTotal = incomeBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">カテゴリ内訳</h2>

      {/* Income Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4 text-green-600">収入の内訳</h3>
        {incomeBreakdown.length === 0 ? (
          <div className="text-center text-gray-500 py-8">収入データがありません</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <PieChart data={incomeBreakdown} colors={PIE_COLORS} />
            </div>
            <div>
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">合計収入</div>
                <div className="text-2xl font-bold text-green-600">¥{incomeTotal.toLocaleString()}</div>
              </div>
              <Legend data={incomeBreakdown} colors={PIE_COLORS} />
            </div>
          </div>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4 text-red-600">支出の内訳</h3>
        {expenseBreakdown.length === 0 ? (
          <div className="text-center text-gray-500 py-8">支出データがありません</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <PieChart data={expenseBreakdown} colors={PIE_COLORS} />
            </div>
            <div>
              <div className="mb-4 p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-gray-600">合計支出</div>
                <div className="text-2xl font-bold text-red-600">¥{expenseTotal.toLocaleString()}</div>
              </div>
              <Legend data={expenseBreakdown} colors={PIE_COLORS} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
