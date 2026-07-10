import { useNavigate } from 'react-router-dom';
import { DollarSign, ChevronRight } from 'lucide-react';
import { useAccountingOverview } from '../../hooks/accounting/useAccountingReports';

export default function DashboardAccountingSection() {
  const navigate = useNavigate();
  const { data: overview, isLoading } = useAccountingOverview({ period: 'month' });

  if (isLoading) {
    return (
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-4 bg-beige animate-pulse rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const summary = overview?.data?.summary;

  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(139,99,56,0.1)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(139,99,56,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontFamily: "'Georgia',serif", fontWeight: 700, color: '#4A3B2F' }}>Accounting Overview</h3>
          <p style={{ margin: 0, fontSize: 11, color: '#7A5C42', opacity: 0.8, marginTop: 2 }}>
            Track your book-related expenses
          </p>
        </div>
        <button
          onClick={() => navigate('/accounting')}
          style={{ fontSize: 11, color: '#7A5C42', display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
        >
          View All <ChevronRight size={13} />
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DollarSign size={22} color="#f59e0b" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#7A5C42', fontWeight: 600, opacity: 0.8 }}>Total Expenses</p>
            <p style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 700, fontFamily: "'Georgia',serif", color: '#4A3B2F' }}>
              {summary?.formatted_total || 'Rp 0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}