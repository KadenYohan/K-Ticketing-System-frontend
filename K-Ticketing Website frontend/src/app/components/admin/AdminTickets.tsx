import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { TICKETS } from '../../data/mockData';
import { QRCode } from '../QRCode';

const DARK = { surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

export default function AdminTickets() {
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = TICKETS.filter(t => {
    const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase());
    const matchPay = payFilter === 'all' || t.paymentMethod === payFilter;
    return matchSearch && matchPay;
  });

  const selectedTicket = TICKETS.find(t => t.id === selected);

  const selectStyle: React.CSSProperties = {
    height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid #2E303A',
    background: '#1E1F27', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text, display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>RECORDS</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Ticket Registry</h1>
        </div>

        {/* Filters */}
        <div style={{ background: DARK.surface, borderRadius: 12, padding: '14px 18px', border: `1px solid ${DARK.border}`, marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} color="#6B7280" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search ticket ID or destination..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', height: 34, padding: '0 10px 0 32px', borderRadius: 8, border: '1px solid #2E303A', background: '#16171D', color: '#F3F4F6', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Payment</option>
            <option value="gcash">GCash</option>
            <option value="cash">Cash</option>
          </select>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, padding: '4px 10px', background: '#16171D', borderRadius: 8, border: '1px solid #2E303A' }}>{filtered.length} tickets</span>
        </div>

        {/* Table */}
        <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1F2028', borderBottom: `1px solid ${DARK.border}` }}>
                {['TICKET', 'DESTINATION', 'SEATS', 'PAX', 'PAYMENT', 'AMOUNT', 'BOARDED'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.6px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(t.id === selected ? null : t.id)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid #1F2028` : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: t.id === selected ? 'rgba(192,132,252,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (t.id !== selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
                  onMouseLeave={e => { if (t.id !== selected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: DARK.accent, background: 'rgba(192,132,252,0.08)', padding: '3px 8px', borderRadius: 6 }}>{t.id}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: DARK.text, fontWeight: 500 }}>{t.destination}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: DARK.muted }}>{t.seats.join(', ')}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: DARK.text }}>{t.passengers}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: t.paymentMethod === 'gcash' ? 'rgba(0,125,255,0.1)' : 'rgba(22,163,74,0.1)', color: t.paymentMethod === 'gcash' ? '#3B82F6' : '#22C55E' }}>
                      {t.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 14, fontWeight: 700, color: DARK.text }}>₱{t.amount}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: t.boarded ? 'rgba(34,197,94,0.1)' : 'rgba(107,99,117,0.1)', color: t.boarded ? '#22C55E' : '#9CA3AF' }}>
                      {t.boarded ? 'BOARDED' : 'PENDING'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket detail panel */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}`, height: 'fit-content', position: 'sticky', top: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK.text }}>Ticket Detail</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 18 }}>×</button>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #D4A800, #e6b800)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 4 }}>TICKET</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{selectedTicket.destination}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{selectedTicket.departure} · {selectedTicket.date}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Ticket ID', value: selectedTicket.id },
              { label: 'Route', value: selectedTicket.route },
              { label: 'Seats', value: selectedTicket.seats.join(', ') },
              { label: 'Passengers', value: `${selectedTicket.passengers} Pax` },
              { label: 'Payment', value: selectedTicket.paymentMethod.toUpperCase() },
              { label: 'Amount', value: `₱${selectedTicket.amount}` },
              { label: 'Created', value: selectedTicket.createdAt },
              { label: 'Boarded', value: selectedTicket.boarded ? `Yes — ${selectedTicket.boardedAt}` : 'No' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, color: DARK.text, textAlign: 'right', fontFamily: label === 'Ticket ID' ? 'monospace' : undefined }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: '#2E303A', marginBottom: 20 }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 8 }}>
              <QRCode value={selectedTicket.qrCode} size={160} />
            </div>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6B7280' }}>{selectedTicket.id}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
