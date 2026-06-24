import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { BUSES, DESTINATIONS, type Bus } from '../../data/mockData';

const DARK = { bg: '#16171D', surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

function StatusBadge({ bus }: { bus: Bus }) {
  if (bus.status === 'departed') return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(107,99,117,0.15)', color: '#9CA3AF' }}>DEPARTED</span>;
  if (bus.available === 0) return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>SOLD OUT</span>;
  if (bus.available <= 5) return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>ALMOST FULL</span>;
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>SCHEDULED</span>;
}

function OccupancyBar({ bus }: { bus: Bus }) {
  const pct = ((bus.capacity - bus.available) / bus.capacity) * 100;
  const color = bus.available === 0 ? '#EF4444' : bus.available <= 5 ? '#F59E0B' : '#22C55E';
  return (
    <div style={{ width: 80 }}>
      <div style={{ height: 4, background: '#2E303A', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{bus.available}/{bus.capacity}</div>
    </div>
  );
}

export default function AdminBuses() {
  const [search, setSearch] = useState('');
  const [destFilter, setDestFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = BUSES.filter(b => {
    const matchSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.destination.toLowerCase().includes(search.toLowerCase());
    const matchDest = destFilter === 'all' || b.destinationId === destFilter;
    const matchStatus = statusFilter === 'all' || b.status === statusFilter || (statusFilter === 'full' && b.available === 0);
    return matchSearch && matchDest && matchStatus;
  });

  const selectStyle: React.CSSProperties = {
    height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid #2E303A',
    background: '#1E1F27', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>FLEET MANAGEMENT</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Bus Management</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '8px 16px', borderRadius: 8, background: '#D4A800', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              + Seed New Buses
            </button>
            <button style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: DARK.surface, borderRadius: 12, padding: '16px 20px', border: `1px solid ${DARK.border}`, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} color="#6B7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search bus ID or destination..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', height: 36, padding: '0 12px 0 36px', borderRadius: 8, border: '1px solid #2E303A', background: '#16171D', color: '#F3F4F6', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={destFilter} onChange={e => setDestFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Destinations</option>
          {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="departed">Departed</option>
          <option value="full">Sold Out</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#16171D', borderRadius: 8, border: '1px solid #2E303A' }}>
          <Filter size={13} color="#6B7280" />
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{filtered.length} results</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${DARK.border}`, background: '#1F2028' }}>
              {['BUS ID', 'DESTINATION', 'DEPARTS', 'AVAILABLE', 'RESERVED', 'BOOKED', 'BOARDED', 'STATUS', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((bus, i) => (
              <motion.tr
                key={bus.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid #1F2028` : 'none',
                  background: bus.status === 'departed' ? 'rgba(107,99,117,0.04)' : bus.available === 0 ? 'rgba(239,68,68,0.03)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = bus.status === 'departed' ? 'rgba(107,99,117,0.04)' : 'transparent'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#D4A800', background: 'rgba(212, 168, 0,0.08)', padding: '3px 8px', borderRadius: 6 }}>{bus.id}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: DARK.text, fontWeight: 500 }}>{bus.destination}</td>
                <td style={{ padding: '12px 16px', fontSize: 16, fontWeight: 700, color: DARK.text, fontFamily: 'monospace' }}>{bus.departure}</td>
                <td style={{ padding: '12px 16px' }}><OccupancyBar bus={bus} /></td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>{bus.reserved}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#EF4444', fontWeight: 600 }}>{bus.booked}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#22C55E', fontWeight: 600 }}>{bus.boarded}</td>
                <td style={{ padding: '12px 16px' }}><StatusBadge bus={bus} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <Link to={`/admin/buses/${bus.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, textDecoration: 'none', background: 'rgba(192,132,252,0.08)', color: DARK.accent, fontSize: 12, fontWeight: 600, border: '1px solid rgba(192,132,252,0.15)', transition: 'all 0.15s' }}>
                    <ExternalLink size={12} /> View
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B7280' }}>
            <p style={{ fontSize: 15 }}>No buses match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
