import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Play, Trash2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { DESTINATIONS, SEED_LOG } from '../../data/mockData';

const DARK = { surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

export default function AdminSeed() {
  const [seedDest, setSeedDest] = useState('all');
  const [seedDate, setSeedDate] = useState('2026-06-23');
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [log, setLog] = useState(SEED_LOG);

  const handleSeed = () => {
    setSeeding(true);
    setTimeout(() => {
      const entry = { timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), message: `Seeded ${seedDest === 'all' ? 'all destinations' : seedDest} for ${seedDate}. ${Math.floor(Math.random() * 8) + 4} buses created.` };
      setLog(prev => [entry, ...prev]);
      toast.success('Seed script completed successfully');
      setSeeding(false);
    }, 2000);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    setResetting(true);
    setTimeout(() => {
      const entry = { timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), message: 'Full data reset completed. All tickets, reservations, payments cleared. Seats reset.' };
      setLog(prev => [entry, ...prev]);
      toast.success('Data reset complete');
      setResetting(false);
      setConfirmReset(false);
    }, 2500);
  };

  const inputStyle: React.CSSProperties = {
    height: 40, padding: '0 12px', borderRadius: 8, border: '1.5px solid #2E303A',
    background: '#16171D', color: '#F3F4F6', fontSize: 13, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text, maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>DATA MANAGEMENT</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Seed & Reset</h1>
      </div>

      {/* Warning banner */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 20px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, marginBottom: 24 }}>
        <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>Warning</div>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>
            These actions affect all booking data system-wide. Seeding creates test data; resetting permanently deletes all tickets, reservations, and payments. Use with caution in production.
          </p>
        </div>
      </div>

      {/* Seed card */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${DARK.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Play size={18} color="#22C55E" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>Seed Buses</h2>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: 14, color: DARK.muted, marginBottom: 20, lineHeight: 1.6 }}>
            Generates a set of bus departures for the specified date and destination. Each destination gets 6–8 evenly-spaced departures.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>DATE</label>
              <input type="date" value={seedDate} onChange={e => setSeedDate(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>DESTINATION</label>
              <select value={seedDest} onChange={e => setSeedDest(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="all">All Destinations</option>
                {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              borderRadius: 10, border: 'none', background: seeding ? '#2E303A' : '#22C55E',
              color: seeding ? '#6B7280' : '#fff', cursor: seeding ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            <Play size={16} />
            {seeding ? 'Running seed script…' : 'Run Seed Script'}
          </button>
        </div>
      </div>

      {/* Reset card */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trash2 size={18} color="#EF4444" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>Full Data Reset</h2>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: 14, color: DARK.muted, marginBottom: 20, lineHeight: 1.6 }}>
            Permanently deletes <strong style={{ color: '#F3F4F6' }}>ALL tickets, reservations, payments</strong>, and resets every seat to available status. This cannot be undone.
          </p>
          {confirmReset && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>
                Are you absolutely sure? Click the button again to confirm. This is irreversible.
              </p>
            </motion.div>
          )}
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              borderRadius: 10, border: 'none', background: resetting ? '#2E303A' : 'rgba(239,68,68,0.12)',
              color: resetting ? '#6B7280' : '#EF4444', cursor: resetting ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            <Trash2 size={16} />
            {resetting ? 'Resetting all data…' : confirmReset ? 'Confirm — Reset All Data' : 'Reset All Data (Irreversible)'}
          </button>
        </div>
      </div>

      {/* Seed log */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${DARK.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Terminal size={16} color="#6B7280" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: DARK.text }}>Operation Log</h2>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
          {log.map((entry, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'monospace' }}>
              <span style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>[{entry.timestamp}]</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{entry.message}</span>
            </div>
          ))}
          {log.length === 0 && (
            <p style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', padding: '16px 0' }}>No operations logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
