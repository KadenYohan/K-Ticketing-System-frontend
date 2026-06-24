import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Clock, MapPin, ArrowRight, Filter } from 'lucide-react';
import { DESTINATIONS, BUSES, type Bus } from '../data/mockData';

function StatusBadge({ bus }: { bus: Bus }) {
  if (bus.status === 'departed') return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(107,99,117,0.1)', color: '#6B6375', letterSpacing: '0.5px' }}>DEPARTED</span>;
  if (bus.available === 0) return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#EF4444', letterSpacing: '0.5px' }}>SOLD OUT</span>;
  if (bus.available <= 5) return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', letterSpacing: '0.5px' }}>ALMOST FULL</span>;
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', letterSpacing: '0.5px' }}>AVAILABLE</span>;
}

export default function RoutesPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [date] = useState('2026-06-23');

  const filteredBuses = activeTab === 'all'
    ? BUSES
    : BUSES.filter(b => b.destinationId === activeTab);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#fff' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', padding: '56px 40px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#facc15', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>SCHEDULES</div>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-1.5px', marginBottom: 12 }}>Routes & Schedules</h1>
          <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.6 }}>
            Browse all available bus departures from One Ayala Makati. Updated in real time.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#F9F8FD', borderBottom: '1px solid #E5E4E7', padding: '0 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {[{ id: 'all', label: 'All Destinations' }, ...DESTINATIONS].map(dest => (
            <button
              key={dest.id}
              onClick={() => setActiveTab(dest.id)}
              style={{
                padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
                color: activeTab === dest.id ? '#D4A800' : '#6B6375',
                borderBottom: activeTab === dest.id ? '2px solid #D4A800' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {dest.id === 'all' ? 'All Destinations' : dest.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredBuses.length}</strong> departures for <strong style={{ color: '#0f172a' }}>{date}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#F9F8FD', borderRadius: 8, border: '1px solid #E5E4E7' }}>
            <Filter size={14} color="#9CA3AF" />
            <span style={{ fontSize: 13, color: '#6B6375' }}>June 23, 2026</span>
          </div>
        </div>

        {/* Route table */}
        <div style={{ border: '1px solid #E5E4E7', borderRadius: 12, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 100px 1fr 80px 100px 120px', background: '#F9F8FD', padding: '12px 20px', borderBottom: '1px solid #E5E4E7', gap: 16 }}>
            {['DESTINATION', 'DEPARTS', 'ROUTE', 'AVAIL.', 'PRICE', 'ACTION'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.7px' }}>{h}</span>
            ))}
          </div>

          {filteredBuses.map((bus, i) => {
            const isUnavailable = bus.status === 'departed' || bus.available === 0;
            return (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 100px 1fr 80px 100px 120px',
                  padding: '16px 20px', gap: 16,
                  borderBottom: i < filteredBuses.length - 1 ? '1px solid #F4F3EC' : 'none',
                  background: isUnavailable ? '#F9F8FD' : '#fff',
                  opacity: isUnavailable ? 0.7 : 1,
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isUnavailable) (e.currentTarget as HTMLElement).style.background = '#F9F8FD'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isUnavailable ? '#F9F8FD' : '#fff'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={14} color="#D4A800" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{bus.destination}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{bus.departure}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>{bus.route}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: bus.available <= 5 ? '#F59E0B' : '#22C55E' }}>
                  {bus.available}/{bus.capacity}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#D4A800' }}>₱{bus.price}</div>
                <div>
                  {!isUnavailable ? (
                    <Link
                      to={`/book?dest=${bus.destinationId}&bus=${bus.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
                        background: 'rgba(212, 168, 0,0.08)', color: '#D4A800',
                        fontSize: 13, fontWeight: 600, border: '1px solid rgba(212, 168, 0,0.2)',
                        transition: 'all 0.15s',
                      }}
                    >
                      Book <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <StatusBadge bus={bus} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Destination info cards */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 24 }}>About These Routes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {DESTINATIONS.map(dest => (
              <div key={dest.id} style={{ padding: 20, background: '#F9F8FD', borderRadius: 12, border: '1px solid #E5E4E7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MapPin size={16} color="#D4A800" />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{dest.name}</span>
                </div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>{dest.fullRoute}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} color="#9CA3AF" />
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{dest.duration}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#D4A800' }}>from ₱{dest.priceFrom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
