import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMonthlyComparison } from '../../hooks/accounting/useAccountingReports';
import type { MonthlyComparison } from '../../types/accounting';

interface MonthlyExpensesChartProps {
  months?: number;
}

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as MonthlyComparison;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-beige dark:border-gray-700">
      <p className="font-medium text-darkBrown dark:text-gray-100">{data.month_name}</p>
      <p className="text-sm text-walnut dark:text-gray-300 mt-1">
        Total: {data.formatted_amount}
      </p>
      <p className="text-xs text-walnut/70 dark:text-gray-400">
        {data.expense_count} expenses
      </p>
      <p className="text-xs text-walnut/70 dark:text-gray-400">
        Avg: {formatCurrency(data.average_expense)}
      </p>
    </div>
  );
};

export default function MonthlyExpensesChart({ months = 12 }: MonthlyExpensesChartProps) {
  const { data: monthlyData, isLoading } = useMonthlyComparison(months);

  // Transform data for chart and calculate statistics
  const chartData = useMemo(() => {
    if (!monthlyData?.data) return [];

    const data = monthlyData.data.map((item: MonthlyComparison) => ({
      ...item,
      // Use short month name for x-axis
      shortMonth: new Date(item.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
    }));

    return data;
  }, [monthlyData]);

  const statistics = useMemo(() => {
    if (!chartData.length) return null;

    const totals = chartData.map(d => d.total_expenses);
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;

    // Calculate trend (compare last 3 months vs previous 3)
    let trend = 0;
    if (chartData.length >= 6) {
      const recent = chartData.slice(-3).reduce((sum, d) => sum + d.total_expenses, 0) / 3;
      const previous = chartData.slice(-6, -3).reduce((sum, d) => sum + d.total_expenses, 0) / 3;
      trend = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    }

    return { max, min, avg, trend };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-beige rounded w-1/3"></div>
          <div className="h-64 bg-beige rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          Monthly Expenses Trend
        </h3>
        <p className="text-center text-walnut/80 py-8">
          No expense data available for the selected period
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream border border-beige rounded-lg shadow-sm">
      <div className="p-6 border-b border-beige">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Expenses Trend
          </h3>
          {statistics && (
            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <p className="text-walnut/80">Avg Monthly</p>
                <p className="font-semibold text-darkBrown">{formatCurrency(statistics.avg)}</p>
              </div>
              <div className={`text-right ${
                statistics.trend >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                <p className="text-xs text-walnut/80">3-Month Trend</p>
                <p className="font-semibold">
                  {statistics.trend >= 0 ? '+' : ''}{statistics.trend.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E8E0D5"
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="shortMonth"
              stroke="#7A5C42"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={60}
              dy={10}
            />
            <YAxis
              stroke="#7A5C42"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total_expenses"
              stroke="#D4A574"
              strokeWidth={2}
              dot={{ fill: '#D4A574', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4A3B2F', strokeWidth: 2 }}
              name="Total Expenses"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        {statistics && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-beige">
            <div className="text-center">
              <p className="text-xs text-walnut/80">Highest</p>
              <p className="font-semibold text-darkBrown">{formatCurrency(statistics.max)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-walnut/80">Lowest</p>
              <p className="font-semibold text-darkBrown">{formatCurrency(statistics.min)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-walnut/80">Average</p>
              <p className="font-semibold text-darkBrown">{formatCurrency(statistics.avg)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
