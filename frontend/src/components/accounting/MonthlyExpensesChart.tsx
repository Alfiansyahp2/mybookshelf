import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BookOpen } from 'lucide-react';
import { usePurchaseHistory } from '../../hooks/books/usePurchaseHistory';

interface PurchaseData {
  month: string;
  month_name: string;
  total_amount: number;
  formatted_amount: string;
  book_count: number;
  average_price: number;
  shortMonth?: string;
}

interface PurchaseHistoryChartProps {
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

  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-beige dark:border-gray-700">
      <p className="font-medium text-darkBrown dark:text-gray-100">{data.month_name}</p>
      <p className="text-sm text-walnut dark:text-gray-300 mt-1">
        Total: {data.formatted_amount}
      </p>
      <p className="text-xs text-walnut/70 dark:text-gray-400">
        {data.book_count} books purchased
      </p>
      <p className="text-xs text-walnut/70 dark:text-gray-400">
        Avg: {formatCurrency(data.average_price)}
      </p>
    </div>
  );
};

export default function PurchaseHistoryChart({ months = 12 }: PurchaseHistoryChartProps) {
  const { data: purchaseHistory, isLoading, error } = usePurchaseHistory(months);

  // Transform data for chart and calculate statistics
  const chartData = useMemo(() => {
    if (!purchaseHistory?.data || !Array.isArray(purchaseHistory.data)) {
      return [];
    }

    const data = purchaseHistory.data.map((item: any) => ({
      ...item,
      // Use short month name for x-axis
      shortMonth: new Date(item.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
    }));

    return data;
  }, [purchaseHistory]);

  const statistics = useMemo(() => {
    if (!chartData.length) return null;

    const totals = chartData.map((d: PurchaseData) => d.total_amount);
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    const avg = totals.reduce((a: number, b: number) => a + b, 0) / totals.length;

    // Calculate trend (compare last 3 months vs previous 3)
    let trend = 0;
    if (chartData.length >= 6) {
      const recent = chartData.slice(-3).reduce((sum: number, d: PurchaseData) => sum + d.total_amount, 0) / 3;
      const previous = chartData.slice(-6, -3).reduce((sum: number, d: PurchaseData) => sum + d.total_amount, 0) / 3;
      trend = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    }

    // Calculate total books purchased
    const totalBooks = chartData.reduce((sum: number, d: PurchaseData) => sum + d.book_count, 0);

    return { max, min, avg, trend, totalBooks };
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

  if (error) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" />
          Purchase History
        </h3>
        <div className="text-center text-walnut/80 py-8">
          <p className="text-red-600 mb-2">Error loading purchase history</p>
          <p className="text-sm text-walnut/60">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-cream border border-beige rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" />
          Purchase History
        </h3>
        <p className="text-center text-walnut/80 py-8">
          No purchase data available for the selected period
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream border border-beige rounded-lg shadow-sm">
      <div className="p-6 border-b border-beige">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-darkBrown flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Book Purchase History
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
              dataKey="total_amount"
              stroke="#D4A574"
              strokeWidth={2}
              dot={{ fill: '#D4A574', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4A3B2F', strokeWidth: 2 }}
              name="Total Purchases"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        {statistics && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-beige">
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
            <div className="text-center">
              <p className="text-xs text-walnut/80">Total Books</p>
              <p className="font-semibold text-darkBrown">{statistics.totalBooks}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
