import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { CONFIG } from './config';
import KioskPage from './pages/kiosk/KioskPage';
import BookPage from './pages/book/BookPage';
import ScannerPage from './pages/scanner/ScannerPage';

function NavBar() {
  const { pathname } = useLocation();

  const tabs = [
    { path: '/',        label: 'Home',    icon: '⌂' },
    { path: '/kiosk',   label: 'Kiosk',   icon: '🖥' },
    { path: '/book',    label: 'Book',    icon: '🎫' },
    { path: '/scanner', label: 'Scanner', icon: '📷' },
  ];

  return (
    <nav className="global-nav" role="navigation" aria-label="Main navigation">
      <div className="global-nav-inner">
        <span className="global-nav-brand">K·TICKETING</span>
        <div className="global-nav-tabs">
          {tabs.map(tab => {
            const isActive = tab.path === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                id={`nav-tab-${tab.label.toLowerCase()}`}
                className={`global-nav-tab${isActive ? ' global-nav-tab-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-tab-icon" aria-hidden="true">{tab.icon}</span>
                <span className="nav-tab-label">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="page-scroll-area">
      <div className="mobile-container" style={{ maxWidth: '640px', padding: '32px 24px' }}>
        <header className="app-header fade-in">
          <h1 style={{ fontSize: '2.4rem' }}>K-TICKETING</h1>
          <p className="app-subtitle" style={{ fontSize: '0.95rem', letterSpacing: '0.18em' }}>
            Network Control Center
          </p>
        </header>

        <div className="alert alert-warning fade-in mt-10" style={{ textAlign: 'left' }}>
          <strong>Prototype Network Mode:</strong> Active in sandbox configuration. Open any terminal client view below to test seat allocations and transactions.
        </div>

        <div className="fade-in mt-20" style={{ display: 'grid', gap: '16px' }}>

          <div className="bus-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>1. Self-Service Kiosk Terminal</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '14px' }}>
                Simulates the Chromium <code>--kiosk</code> physical installation in departure bays.
                Supports both GCash QR codes and terminal cash payments.
              </p>
            </div>
            <Link to="/kiosk" id="dash-launch-kiosk" className="btn btn-primary btn-gradient" style={{ textDecoration: 'none', display: 'inline-flex', maxWidth: '240px' }}>
              Launch Kiosk Interface
            </Link>
          </div>

          <div className="bus-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>2. Passenger Booking Portal</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '14px' }}>
                Mobile-optimized booking app used by passengers on their personal browsers.
                Restricts transactions to GCash payment processing.
              </p>
            </div>
            <Link to="/book" id="dash-launch-book" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', border: '1px solid #6366f1', color: '#6366f1', maxWidth: '240px' }}>
              Launch Mobile Web App
            </Link>
          </div>

          <div className="bus-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>3. Conductor Boarding Scanner</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '14px' }}>
                Mobile scan tool used by terminal conductors to check tickets via HTML5 camera feed
                and record boarded bus runs.
              </p>
            </div>
            <Link to="/scanner" id="dash-launch-scanner" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', border: '1px solid var(--success)', color: 'var(--success)', maxWidth: '240px' }}>
              Launch Conductor Scanner
            </Link>
          </div>

        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '32px', fontSize: '0.78rem', opacity: 0.45, textAlign: 'center' }}>
          <p>K-Ticketing Prototype Network • 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  console.log('KIOSK_ENABLED:', CONFIG.KIOSK_ENABLED);
  return (
    <Router>
      <div className="app-shell">
        {!CONFIG.KIOSK_ENABLED && <NavBar />}
        <main className="app-main">
          <Routes>
            <Route path="/"        element={<DashboardPlaceholder />} />
            <Route path="/kiosk"   element={CONFIG.KIOSK_ENABLED ? <KioskPage /> : <Navigate to="/" replace />} />
            <Route path="/book"    element={<BookPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}