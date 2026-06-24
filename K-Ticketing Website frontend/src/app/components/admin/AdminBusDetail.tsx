import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { getBusById, getSeatsForBus, type Seat } from '../../data/mockData';
import { SeatGrid } from '../SeatGrid';

const DARK = { bg: '#16171D', surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

const ACTIVITY_LOG = [
  { time: '11:45', event: 'Seat 3A boarded', type: 'boarded' },
  { time: '11:30', event: 'Seat 5B booked via GCash', type: 'booked' },
  { time: '11:22', event: 'Seat 6C reservation expired', type: 'expired' },
  { time: '11:10', event: 'Seat 8A reserved by passenger', type: 'reserved' },
  { time: '10:55', event: 'Seat 2D boarded', type: 'boarded' },
  { time: '10:40', event: 'Seat 7B booked via Cash', type: 'booked' },
  { time: '10:30', event: 'Seat 4A reserved by passenger', type: 'reserved' },
  { time: '10:18', event: 'Seat 1C boarded', type: 'boarded' },
];

const eventColor = (type: string) =>
  type === 'boarded' ? '#22C55E' : type === 'booked' ? '#D4A800' : type === 'expired' ? '#EF4444' : '#F59E0B';

export default function AdminBusDetail() {
  const { busId } = useParams<{ busId: string }>();
  const bus = getBusById(busId || '');
  const [seats, setSeats] = useState<Seat[]>(() => getSeatsForBus(busId || ''));
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeats(getSeatsForBus(busId || ''));
      setLastRefresh(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [busId]);

  if (!bus) return (
    <div style={{ color: DARK.muted, fontFamily: 'Inter, sans-serif', padding: 40 }}>
      <Link to="/admin/buses" style={{ color: DARK.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Buses
      </Link>
      <p>Bus not found.</p>
    </div>
  );

  const handleRefresh = () => {
    setSeats(getSeatsForBus(busId || ''));
    setLastRefresh(new Date());
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text }}>
      {/* Back + header */}
      <Link to="/admin/buses" style={{ display: 'flex', alignItems: 'center', gap: 6, color: DARK.muted, textDecoration: 'none', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to Buses
      </Link>

      <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}`, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: DARK.accent, background: 'rgba(192,132,252,0.1)', padding: '3px 8px', borderRadius: 6, marginBottom: 8, display: 'inline-block' }}>{bus.id}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK.text, letterSpacing: '-0.5px', marginBottom: 6 }}>
              {bus.destination} @ {bus.departure}
            </h1>
            <p style={{ fontSize: 14, color: DARK.muted }}>{bus.route}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Available', value: bus.available, color: '#22C55E' },
              { label: 'Reserved', value: bus.reserved, color: '#F59E0B' },
              { label: 'Booked', value: bus.booked, color: '#EF4444' },
              { label: 'Boarded', value: bus.boarded, color: '#D4A800' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 16px', background: '#16171D', borderRadius: 10, border: `1px solid #2E303A`, minWidth: 80 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 11, color: DARK.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: bus.status === 'departed' ? 'rgba(107,99,117,0.15)' : 'rgba(34,197,94,0.1)', color: bus.status === 'departed' ? '#9CA3AF' : '#22C55E' }}>
            {bus.status.toUpperCase()}
          </span>
          <span style={{ fontSize: 14, color: DARK.muted }}>₱{bus.price}/seat · {bus.capacity} total seats</span>
        </div>
      </div>

      {/* Two panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Seat map */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>Live Seat Map</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} color="#6B7280" />
                <span style={{ fontSize: 11, color: '#6B7280' }}>Updated {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={handleRefresh}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #2E303A', background: '#16171D', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: DARK.muted }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>
          <div style={{ background: '#16171D', borderRadius: 12, padding: 20 }}>
            <SeatGrid seats={seats} showBoarded compact={false} />
          </div>
          <p style={{ fontSize: 11, color: '#4B5563', textAlign: 'center', marginTop: 12, fontStyle: 'italic' }}>Auto-refreshes every 10 seconds</p>
        </div>

        {/* Activity log */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text, marginBottom: 20 }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid #1F2028' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: eventColor(entry.type), flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: DARK.text }}>{entry.event}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{entry.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '14px 16px', background: '#16171D', borderRadius: 10, border: '1px solid #2E303A' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>SEAT SUMMARY</div>
            <div style={{ fontSize: 13, color: DARK.muted, lineHeight: 2 }}>
              <div>Available: <strong style={{ color: '#22C55E' }}>{bus.available}</strong></div>
              <div>Reserved: <strong style={{ color: '#F59E0B' }}>{bus.reserved}</strong></div>
              <div>Booked: <strong style={{ color: '#EF4444' }}>{bus.booked}</strong></div>
              <div>Boarded: <strong style={{ color: '#D4A800' }}>{bus.boarded}</strong></div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #2E303A' }}>
                Occupancy: <strong style={{ color: DARK.text }}>
                  {Math.round(((bus.capacity - bus.available) / bus.capacity) * 100)}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
