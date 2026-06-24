import { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { PAYMENTS, type PaymentStatus } from '../../data/mockData';

const DARK = { surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = {
    paid: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'PAID' },
    pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'PENDING' },
    failed: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'FAILED' },
  }[status];
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: config.bg, color: config.color }}>{config.label}</span>;
}

export default function AdminPayments() {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = PAYMENTS.filter(p => {
    const matchSearch = !search || p.id.includes(search) || p.ticketId.includes(search);
    const matchMethod = methodFilter === 'all' || p.method === methodFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalPaid = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  const selectStyle: React.CSSProperties = {
    height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid #2E303A',
    background: '#1E1F27', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>TRANSACTIONS</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Payment Transactions</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: `₱${totalPaid.toLocaleString()}`, color: '#22C55E' },
          { label: 'GCash Payments', value: `${PAYMENTS.filter(p => p.method === 'gcash' && p.status === 'paid').length} txns`, color: '#007DFF' },
          { label: 'Cash Payments', value: `${PAYMENTS.filter(p => p.method === 'cash' && p.status === 'paid').length} txns`, color: '#16A34A' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: DARK.surface, borderRadius: 12, padding: '20px 24px', border: `1px solid ${DARK.border}` }}>
            <div style={{ fontSize: 13, color: DARK.muted, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: DARK.surface, borderRadius: 12, padding: '14px 18px', border: `1px solid ${DARK.border}`, marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} color="#6B7280" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text" placeholder="Search payment or ticket ID..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', height: 34, padding: '0 10px 0 32px', borderRadius: 8, border: '1px solid #2E303A', background: '#16171D', color: '#F3F4F6', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Methods</option>
          <option value="gcash">GCash</option>
          <option value="cash">Cash</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1F2028', borderBottom: `1px solid ${DARK.border}` }}>
              {['PAYMENT ID', 'TICKET ID', 'METHOD', 'AMOUNT', 'STATUS', 'REFERENCE', 'TIMESTAMP'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid #1F2028` : 'none',
                  transition: 'background 0.15s',
                  background: p.status === 'failed' ? 'rgba(239,68,68,0.03)' : 'transparent',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = p.status === 'failed' ? 'rgba(239,68,68,0.03)' : 'transparent'}
              >
                <td style={{ padding: '11px 16px' }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: DARK.accent, background: 'rgba(192,132,252,0.08)', padding: '3px 8px', borderRadius: 6 }}>{p.id}</span>
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#9CA3AF' }}>{p.ticketId}</span>
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: p.method === 'gcash' ? 'rgba(0,125,255,0.1)' : 'rgba(22,163,74,0.1)', color: p.method === 'gcash' ? '#007DFF' : '#16A34A' }}>
                    {p.method.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '11px 16px', fontSize: 15, fontWeight: 700, color: DARK.text }}>₱{p.amount}</td>
                <td style={{ padding: '11px 16px' }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: '11px 16px', fontSize: 12, fontFamily: 'monospace', color: '#6B7280' }}>{p.reference || '—'}</td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: DARK.muted }}>{p.timestamp}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>No transactions match the current filters.</div>
        )}
      </div>
    </div>
  );
}
