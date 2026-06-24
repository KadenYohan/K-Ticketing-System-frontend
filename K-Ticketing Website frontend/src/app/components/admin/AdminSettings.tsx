import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, ToggleLeft, ToggleRight, Wifi, WifiOff, Server, Code } from 'lucide-react';
import { toast } from 'sonner';

const DARK = { surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

export default function AdminSettings() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');
  const [useMock, setUseMock] = useState(true);
  const [mockDatetime, setMockDatetime] = useState('2026-06-23T08:00:00');
  const [connected] = useState(true);
  const [latency] = useState(12);

  const inputStyle: React.CSSProperties = {
    flex: 1, height: 44, padding: '0 14px', borderRadius: 10, border: '1.5px solid #2E303A',
    background: '#16171D', color: '#F3F4F6', fontSize: 14, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text, maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>CONFIGURATION</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>System Settings</h1>
      </div>

      {/* API Configuration */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${DARK.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Server size={18} color="#D4A800" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>API Configuration</h2>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK.muted, marginBottom: 8, letterSpacing: '0.3px' }}>API Base URL</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#D4A800'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2E303A'}
              />
              <button
                onClick={() => toast.success('API URL saved')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderRadius: 10, border: 'none', background: '#D4A800', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
              >
                <Save size={15} /> Save
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `1px solid ${DARK.border}`, borderBottom: `1px solid ${DARK.border}`, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: DARK.text, marginBottom: 4 }}>Use Mock Data</div>
              <div style={{ fontSize: 13, color: DARK.muted }}>When enabled, the app uses local mock data instead of calling the API.</div>
            </div>
            <button
              onClick={() => setUseMock(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: useMock ? '#D4A800' : '#6B7280', transition: 'color 0.2s' }}
            >
              {useMock ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
            </button>
          </div>

          {useMock && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: DARK.muted, marginBottom: 8, letterSpacing: '0.3px' }}>Mock Datetime (ISO-8601)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="datetime-local"
                  value={mockDatetime}
                  onChange={e => setMockDatetime(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#D4A800'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2E303A'}
                />
                <button
                  onClick={() => toast.success('Mock datetime applied')}
                  style={{ padding: '0 16px', borderRadius: 10, border: '1px solid #2E303A', background: 'transparent', color: DARK.muted, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${DARK.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code size={18} color="#3B82F6" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>System Information</h2>
          </div>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Frontend Version', value: '1.0.0', mono: true },
            { label: 'Build Mode', value: 'Development' },
            { label: 'React Version', value: '18.3.1', mono: true },
            { label: 'Node Environment', value: 'development' },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid #1F2028` }}>
              <span style={{ fontSize: 14, color: DARK.muted }}>{label}</span>
              <span style={{ fontSize: 14, color: DARK.text, fontWeight: 600, fontFamily: mono ? 'monospace' : undefined }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: 14, color: DARK.muted }}>Backend Connection</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {connected ? (
                <>
                  <Wifi size={16} color="#22C55E" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>Connected</span>
                  <span style={{ fontSize: 12, color: '#6B7280', background: '#16171D', padding: '2px 8px', borderRadius: 999, border: '1px solid #2E303A' }}>{latency}ms</span>
                </>
              ) : (
                <>
                  <WifiOff size={16} color="#EF4444" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
