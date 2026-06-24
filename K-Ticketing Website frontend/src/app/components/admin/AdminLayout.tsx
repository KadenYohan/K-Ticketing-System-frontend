import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import {
  LayoutDashboard, Bus, Ticket, CreditCard, Settings, Database,
  LogOut, Radio, ChevronRight, MonitorSmartphone, QrCode
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { to: '/admin/buses', label: 'Bus Management', icon: Bus, group: 'main' },
  { to: '/admin/tickets', label: 'Ticket Registry', icon: Ticket, group: 'main' },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard, group: 'main' },
  { to: 'http://localhost:5173/', label: 'Terminal Kiosk', icon: MonitorSmartphone, group: 'apps' },
  { to: 'http://localhost:5173/scanner', label: 'Conductor Scanner', icon: QrCode, group: 'apps' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, group: 'system' },
  { to: '/admin/seed', label: 'Seed & Reset', icon: Database, group: 'system' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('k_admin_auth');
    if (!auth) navigate('/admin');
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('k_admin_auth');
    navigate('/admin');
  };

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div className="dark" style={{ display: 'flex', minHeight: '100vh', background: '#16171D', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: '#1E1F27', borderRight: '1px solid #2E303A',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #2E303A' }}>
          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D4A800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>K</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F3F4F6', lineHeight: 1.2 }}>K-Ticketing</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Admin Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4B5563', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 8px 8px' }}>MANAGEMENT</div>
          {NAV_ITEMS.filter(n => n.group === 'main').map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                  textDecoration: 'none', transition: 'all 0.15s',
                  color: active ? '#facc15' : '#9CA3AF',
                  background: active ? 'rgba(250,204,21,0.1)' : 'transparent',
                  borderLeft: active ? '2px solid #D4A800' : '2px solid transparent',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={17} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
              </Link>
            );
          })}

          <div style={{ height: 1, background: '#2E303A', margin: '12px 0' }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4B5563', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 8px 8px' }}>APPS</div>
          {NAV_ITEMS.filter(n => n.group === 'apps').map(({ to, label, icon: Icon }) => {
            const active = false; // External links are never "active" in this context
            return (
              <a
                key={to}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                  textDecoration: 'none', transition: 'all 0.15s',
                  color: '#9CA3AF',
                  background: 'transparent',
                  borderLeft: '2px solid transparent',
                  fontSize: 14, fontWeight: 400,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={17} />
                {label}
              </a>
            );
          })}

          <div style={{ height: 1, background: '#2E303A', margin: '12px 0' }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4B5563', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 8px 8px' }}>SYSTEM</div>
          {NAV_ITEMS.filter(n => n.group === 'system').map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                  textDecoration: 'none', transition: 'all 0.15s',
                  color: active ? '#facc15' : '#9CA3AF',
                  background: active ? 'rgba(250,204,21,0.1)' : 'transparent',
                  borderLeft: active ? '2px solid #D4A800' : '2px solid transparent',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User / Sign out */}
        <div style={{ padding: '16px 12px 20px', borderTop: '1px solid #2E303A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #D4A800, #e6b800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>A</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F3F4F6' }}>Admin</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>admin@kticketing.ph</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6B7280'}
            >
              <LogOut size={16} />
            </button>
          </div>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', marginTop: 6, borderRadius: 8, textDecoration: 'none', fontSize: 13, color: '#6B7280', transition: 'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#9CA3AF'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6B7280'}>
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 260, padding: '32px', minHeight: '100vh', background: '#16171D' }}>
        <Outlet />
      </main>
    </div>
  );
}
