import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { BUSES, getSeatsForBus, TICKETS } from '../../data/mockData';
import { SeatGrid } from '../SeatGrid';
import { QRCode } from '../QRCode';

const DARK = { surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

export default function AdminScanner() {
  const [selectedBusId, setSelectedBusId] = useState('');
  const [scanResult, setScanResult] = useState<'valid' | 'invalid' | null>(null);
  const [scannedTicket, setScannedTicket] = useState<typeof TICKETS[0] | null>(null);
  const [scanInput, setScanInput] = useState('');

  const selectedBus = BUSES.find(b => b.id === selectedBusId);
  const seats = selectedBusId ? getSeatsForBus(selectedBusId) : [];

  const handleScan = () => {
    const ticket = TICKETS.find(t => t.id === scanInput || t.qrCode === scanInput);
    if (ticket && ticket.busId === selectedBusId && !ticket.boarded) {
      setScanResult('valid');
      setScannedTicket(ticket);
    } else {
      setScanResult('invalid');
      setScannedTicket(null);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>BOARDING CONTROL</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Live Scanner View</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Scanner panel */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text, marginBottom: 20 }}>Conductor Scanner</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>SELECT BUS</label>
            <select
              value={selectedBusId}
              onChange={e => { setSelectedBusId(e.target.value); setScanResult(null); }}
              style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid #2E303A', background: '#16171D', color: '#F3F4F6', fontSize: 14, outline: 'none', cursor: 'pointer' }}
            >
              <option value="">— Select a bus —</option>
              {BUSES.filter(b => b.status !== 'departed').map(b => (
                <option key={b.id} value={b.id}>{b.departure} → {b.destination} (ID: {b.id})</option>
              ))}
            </select>
          </div>

          {selectedBus && (
            <>
              <div style={{ padding: '12px 16px', background: '#16171D', borderRadius: 10, border: '1px solid #2E303A', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>Active Bus</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK.text }}>{selectedBus.departure} — {selectedBus.destination}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{selectedBus.id}</div>
              </div>

              {/* Simulated QR scan input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>SIMULATE QR SCAN (enter ticket ID)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                    placeholder="e.g. tkt-001"
                    style={{ flex: 1, height: 44, padding: '0 12px', borderRadius: 10, border: '1.5px solid #2E303A', background: '#16171D', color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'monospace' }}
                  />
                  <button
                    onClick={handleScan}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderRadius: 10, border: 'none', background: '#D4A800', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
                  >
                    <Scan size={16} /> Scan
                  </button>
                </div>
                <p style={{ fontSize: 11, color: '#4B5563', marginTop: 6 }}>Try: tkt-001, tkt-003, tkt-006 with matching bus selected</p>
              </div>

              {/* Scan result */}
              <AnimatePresence mode="wait">
                {scanResult === 'valid' && scannedTicket && (
                  <motion.div key="valid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ padding: '20px', background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <CheckCircle2 size={22} color="#22C55E" />
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#22C55E' }}>TICKET VALID</span>
                    </div>
                    <div style={{ fontSize: 14, color: DARK.text }}>Seats: <strong>{scannedTicket.seats.join(', ')}</strong></div>
                    <div style={{ fontSize: 13, color: DARK.muted }}>Passengers: {scannedTicket.passengers} Pax</div>
                    <button style={{ marginTop: 14, width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: '#22C55E', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                      Check In & Board
                    </button>
                    <button onClick={() => setScanResult(null)} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #2E303A', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', fontSize: 13 }}>
                      Cancel
                    </button>
                  </motion.div>
                )}
                {scanResult === 'invalid' && (
                  <motion.div key="invalid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ padding: '20px', background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.3)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <XCircle size={22} color="#EF4444" />
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>ACCESS DENIED</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Ticket not found, already boarded, or not assigned to this bus.</p>
                    <button onClick={() => { setScanResult(null); setScanInput(''); }} style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #2E303A', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Dismiss & Continue Scanning
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {!selectedBus && (
            <div style={{ padding: 32, textAlign: 'center', color: '#4B5563' }}>
              <Scan size={32} color="#2E303A" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14 }}>Select a bus to activate the scanner.</p>
            </div>
          )}
        </div>

        {/* Live seat map */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>Live Seat Map</h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #2E303A', background: '#16171D', cursor: 'pointer', fontSize: 12, color: DARK.muted }}>
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          {selectedBus ? (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', padding: '10px 16px', background: '#16171D', borderRadius: 10, border: '1px solid #2E303A' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#D4A800' }}>{selectedBus.boarded}</div>
                  <div style={{ fontSize: 11, color: DARK.muted, textTransform: 'uppercase', fontWeight: 600 }}>Boarded</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 16px', background: '#16171D', borderRadius: 10, border: '1px solid #2E303A' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#22C55E' }}>{selectedBus.available}</div>
                  <div style={{ fontSize: 11, color: DARK.muted, textTransform: 'uppercase', fontWeight: 600 }}>Remaining</div>
                </div>
              </div>
              <div style={{ background: '#16171D', borderRadius: 12, padding: 16 }}>
                <SeatGrid seats={seats} showBoarded compact />
              </div>
            </>
          ) : (
            <div style={{ padding: 48, textAlign: 'center', color: '#4B5563' }}>
              <p>Select a bus to see its seat map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
