import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Ticket, MapPin, Clock, Check, AlertCircle } from 'lucide-react';
import { TICKETS, type Ticket as TicketType } from '../data/mockData';
import { QRCode } from './QRCode';

export default function TicketLookupPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TicketType | null | 'not-found'>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const found = TICKETS.find(t => t.id.toLowerCase().includes(query.toLowerCase()));
      setResult(found || 'not-found');
      setLoading(false);
    }, 600);
  };

  // Also check localStorage for recent ticket
  const lastTicketId = typeof window !== 'undefined' ? localStorage.getItem('last_ticket_id') : null;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', padding: '56px 40px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#facc15', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>TICKET RETRIEVAL</div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-1.5px', marginBottom: 12 }}>Find My Ticket</h1>
        <p style={{ fontSize: 17, color: '#9CA3AF', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Lost your tab? Enter your Ticket ID to retrieve your QR boarding pass.
        </p>
      </div>

      {/* Lookup form */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 40px 80px' }}>
        <div style={{ background: '#F9F8FD', borderRadius: 20, padding: 32, border: '1px solid #E5E4E7', marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
            Ticket ID
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="e.g. tkt-001"
              style={{
                flex: 1, height: 48, padding: '0 16px', borderRadius: 10, border: '1.5px solid #E5E4E7',
                fontSize: 15, fontFamily: 'monospace', outline: 'none', background: '#fff',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#D4A800'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E5E4E7'}
            />
            <button
              onClick={handleLookup}
              disabled={loading || !query.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0 20px', borderRadius: 10, border: 'none',
                background: query.trim() ? '#D4A800' : '#E5E4E7',
                color: query.trim() ? '#fff' : '#9CA3AF',
                fontSize: 14, fontWeight: 700, cursor: query.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              <Search size={16} /> Look Up
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 10 }}>
            Try: <code style={{ background: '#E5E4E7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>tkt-001</code>{' '}
            through <code style={{ background: '#E5E4E7', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>tkt-010</code>
          </p>
        </div>

        {/* Demo tickets */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 12 }}>SAMPLE TICKET IDs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TICKETS.slice(0, 5).map(t => (
              <button
                key={t.id}
                onClick={() => { setQuery(t.id); }}
                style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E4E7',
                  background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace',
                  color: '#6B6375', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4A800'; (e.currentTarget as HTMLElement).style.color = '#D4A800'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E4E7'; (e.currentTarget as HTMLElement).style.color = '#6B6375'; }}
              >
                {t.id}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: 32 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>
                <Search size={32} color="#D4A800" />
              </motion.div>
              <p style={{ fontSize: 15, color: '#9CA3AF', marginTop: 12 }}>Searching...</p>
            </motion.div>
          )}

          {result === 'not-found' && !loading && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: 24, background: 'rgba(239,68,68,0.06)', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <AlertCircle size={24} color="#EF4444" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', marginBottom: 6 }}>Ticket Not Found</div>
                <p style={{ fontSize: 14, color: '#6B6375', lineHeight: 1.6 }}>
                  No ticket matching "<strong>{query}</strong>" was found. Please check the ID and try again, or contact terminal staff for assistance.
                </p>
              </div>
            </motion.div>
          )}

          {result && result !== 'not-found' && !loading && (
            <motion.div key="found" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, border: '1px solid rgba(34,197,94,0.2)' }}>
                <Check size={18} color="#22C55E" />
                <span style={{ fontSize: 15, fontWeight: 600, color: '#22C55E' }}>Ticket Found!</span>
              </div>

              <div style={{ background: '#fff', borderRadius: 20, border: '2px dashed #E5E4E7', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.07)' }}>
                {/* Ticket header */}
                <div style={{ background: 'linear-gradient(135deg, #D4A800, #e6b800)', padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 4 }}>K-TICKETING TICKET</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{result.route}</div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 24 }}>
                    {[
                      { label: 'DATE', value: result.date },
                      { label: 'DEPARTURE', value: result.departure },
                      { label: 'SEATS', value: result.seats.join(', ') },
                      { label: 'PASSENGERS', value: `${result.passengers} Pax` },
                      { label: 'PAYMENT', value: result.paymentMethod.toUpperCase() },
                      { label: 'AMOUNT', value: `₱${result.amount}` },
                      { label: 'STATUS', value: result.boarded ? 'Boarded ✓' : 'Not yet boarded' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: 1, borderTop: '2px dashed #E5E4E7', marginBottom: 24 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <QRCode value={result.qrCode} size={180} />
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#9CA3AF' }}>{result.id}</div>
                    <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>
                      Show this QR code to the conductor when boarding.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
