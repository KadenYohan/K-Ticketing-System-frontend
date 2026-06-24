import { Link } from 'react-router';
import { Wifi, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#9CA3AF',
      fontFamily: 'Inter, system-ui, sans-serif',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 40px 32px' }}>
        {/* Main footer grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}
             className="grid-cols-footer">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: '#D4A800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>K</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#F3F4F6' }}>K-Ticketing</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B7280', maxWidth: 260, marginBottom: 20 }}>
              Fast, simple, and reliable bus ticketing for the modern commuter. Book your seat in seconds — no queues, no hassle.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
              background: 'rgba(34,197,94,0.1)', borderRadius: 20, width: 'fit-content',
              border: '1px solid rgba(34,197,94,0.2)' }}>
              <Wifi size={14} color="#22C55E" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E', letterSpacing: '0.4px' }}>LOCAL NETWORK</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F3F4F6', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>Quick Links</h4>
            {[
              { to: '/book', label: 'Book a Ticket' },
              { to: '/routes', label: 'View Routes' },
              { to: '/tickets', label: 'My Tickets' },
              { to: '/how-it-works', label: 'How It Works' },
              { to: '/admin', label: 'Admin Portal' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', marginBottom: 10, textDecoration: 'none',
                fontSize: 14, color: '#9CA3AF', transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#facc15'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9CA3AF'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Routes */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F3F4F6', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>Routes</h4>
            {['Calamba', 'Alabang Town Center', 'Nuvali', 'Imus Cavite', 'Robinsons Antipolo', 'Robinsons Las Pinas'].map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <MapPin size={12} color="#6B7280" />
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F3F4F6', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>Support</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Phone size={14} color="#6B7280" />
              <span style={{ fontSize: 14, color: '#9CA3AF' }}>Terminal Hotline</span>
            </div>
            <div style={{ fontSize: 14, color: '#D4A800', marginBottom: 16, marginLeft: 22 }}>(02) 8888-K-TIX</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mail size={14} color="#6B7280" />
              <span style={{ fontSize: 14, color: '#9CA3AF' }}>support@kticketing.ph</span>
            </div>
            <div style={{ marginTop: 20, padding: '10px 14px', background: '#1E1F27', borderRadius: 8, border: '1px solid #2E303A' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>Kiosk & Scanner</div>
              <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: '#facc15', textDecoration: 'none', marginBottom: 4 }}>Terminal Kiosk →</a>
              <a href="http://localhost:5173/scanner" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: '#facc15', textDecoration: 'none' }}>Conductor Scanner →</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#1E1F27', marginBottom: 24 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            © 2026 K-Ticketing System. All rights reserved. — P2P Bus Terminal Network
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#4B5563', fontFamily: 'monospace' }}>v1.0.0</span>
            <div style={{ padding: '4px 10px', background: '#1E1F27', borderRadius: 20, border: '1px solid #2E303A' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px' }}>MADE IN 🇵🇭</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
