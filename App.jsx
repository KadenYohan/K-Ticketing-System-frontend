import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KioskPage from './pages/kiosk/KioskPage';
import ScannerPage from './pages/scanner/ScannerPage';

function DashboardPlaceholder() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>K-Ticketing Network Prototype Index</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
        <Link to="/kiosk" style={{ padding: '15px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Open Terminal Kiosk View
        </Link>
        <Link to="/book" style={{ padding: '15px', background: '#9c27b0', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Open Mobile Passenger Web App
        </Link>
        <Link to="/scanner" style={{ padding: '15px', background: '#2e7d32', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          Open Conductor QR Scanner View
        </Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPlaceholder />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/book" element={<KioskPage />} /> {/* Swapped structural mapping target for testing */}
        <Route path="/scanner" element={<ScannerPage />} />
      </Routes>
    </Router>
  );
}