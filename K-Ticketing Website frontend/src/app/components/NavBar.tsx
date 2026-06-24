import { Link, useLocation } from 'react-router';
import { Ticket, Map, HelpCircle, ShieldCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '?');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        background: scrolled ? 'rgba(255,255,255,0.85)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        borderBottom: '1px solid #E5E4E7',
        transition: 'background 0.3s, backdrop-filter 0.3s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#D4A800',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(212, 168, 0,0.35)',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>K</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
            K-<span style={{ color: '#D4A800' }}>Ticketing</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
          {[
            { to: '/book', label: 'Book a Ticket', icon: <Ticket size={15} /> },
            { to: '/routes', label: 'Routes', icon: <Map size={15} /> },
            { to: '/how-it-works', label: 'How It Works', icon: <HelpCircle size={15} /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 500,
                color: isActive(to) ? '#D4A800' : '#6B6375',
                background: isActive(to) ? 'rgba(212, 168, 0,0.08)' : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive(to)) (e.currentTarget as HTMLElement).style.background = '#F9F8FD';
              }}
              onMouseLeave={e => {
                if (!isActive(to)) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {icon}{label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/tickets"
            style={{
              padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500,
              color: '#6B6375', border: '1px solid #E5E4E7', background: 'transparent',
              transition: 'all 0.15s',
            }}
            className="hidden md:block"
          >
            My Tickets
          </Link>
          <Link
            to="/admin"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              color: '#D4A800', border: '1px solid rgba(212, 168, 0,0.4)',
              background: 'rgba(212, 168, 0,0.06)', transition: 'all 0.15s',
            }}
          >
            <ShieldCheck size={15} />
            <span className="hidden md:inline">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6375', padding: 8 }}
            className="md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0, background: '#fff',
          borderBottom: '1px solid #E5E4E7', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {[
            { to: '/book', label: 'Book a Ticket' },
            { to: '/routes', label: 'Routes' },
            { to: '/how-it-works', label: 'How It Works' },
            { to: '/tickets', label: 'My Tickets' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 500,
                color: isActive(to) ? '#D4A800' : '#0f172a',
                background: isActive(to) ? 'rgba(212, 168, 0,0.08)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
