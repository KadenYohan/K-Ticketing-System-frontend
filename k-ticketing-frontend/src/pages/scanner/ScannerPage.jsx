import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { API } from '../../api';
import StatusBadge from '../../components/StatusBadge';

export default function ScannerPage() {
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(() => sessionStorage.getItem('conductor_bus_id') || '');
  const [scanResult, setScanResult] = useState(null); // null, or verification model object payload
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Fetch all active buses for today without route filtering
    API.getBuses(today, '')
      .then(setActiveBuses)
      .catch(err => {
        console.error("Failed to load buses for conductor scanner:", err);
      });
  }, []);

  const handleBusSelectionChange = (e) => {
    const id = e.target.value;
    setSelectedBusId(id);
    sessionStorage.setItem('conductor_bus_id', id);
    setScanResult(null);
  };

  useEffect(() => {
    if (selectedBusId && isScanning && !scanResult) {
      scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      
      const onScanSuccess = async (decodedText) => {
        try {
          await scannerRef.current.clear();
          setIsScanning(false);
          const validation = await API.validateTicket(decodedText, selectedBusId);
          setScanResult({ ...validation, ticketId: decodedText });
        } catch (err) {
          console.error("Scanner validation error:", err);
          setScanResult({ valid: false, reason: "System communication failure.", seats: [] });
        }
      };

      scannerRef.current.render(onScanSuccess, () => {});
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [selectedBusId, isScanning, scanResult]);

  const handleConfirmBoarding = async () => {
    if (!scanResult) return;
    try {
      await API.checkInTicket(scanResult.ticketId, selectedBusId);
      alert("Boarding Confirmed!");
      setScanResult(null);
      setIsScanning(true);
    } catch (err) {
      console.error(err);
      alert("Check-in request failed.");
    }
  };

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>BOARDING SCANNER</h1>
        <p className="app-subtitle">Conductor Control Panel</p>
      </header>

      <div className="bus-card fade-in" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>Active Departure Run</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '16px' }}>
          Select the scheduled bus route you are currently checking in:
        </p>
        <select 
          value={selectedBusId} 
          onChange={handleBusSelectionChange} 
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '14px', 
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-heading)',
            fontWeight: '600',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'var(--transition)'
          }}
        >
          <option value="">-- Choose Assigned Departure Run --</option>
          {activeBuses.map(b => (
            <option key={b.id} value={b.id}>
              {b.destination} @ {b.departureTime} ({b.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {selectedBusId && !scanResult && !isScanning && (
        <div className="fade-in mt-10">
          <button 
            onClick={() => setIsScanning(true)} 
            className="btn btn-primary btn-gradient btn-large"
          >
            Activate Camera Engine Scanner
          </button>
        </div>
      )}

      <div id="reader" style={{ width: '100%', margin: '16px 0', overflow: 'hidden', borderRadius: '12px' }}></div>

      {scanResult && (
        <div className="fade-in mt-10">
          {scanResult.valid ? (
            <div className="payment-card" style={{ borderTop: '5px solid var(--success)', padding: '24px' }}>
              {/* Premium haptic animated checkmark icon */}
              <div className="validation-icon-scale validation-icon-success scale-in">✓</div>
              <h3 style={{ color: 'var(--success)', fontSize: '1.4rem', margin: '0 0 8px 0' }}>TICKET VALID</h3>
              <StatusBadge status="valid" />
              
              <div className="ticket-divider" style={{ margin: '16px 0' }} />
              
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                  Allocated Seats: <strong style={{ color: 'var(--text-heading)', fontSize: '1.2rem', marginLeft: '6px' }}>{scanResult.seats.join(', ')}</strong>
                </p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Remaining Unboarded on Run: <strong style={{ color: 'var(--text-heading)' }}>{scanResult.remainingUnboarded} Pax</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                <button 
                  onClick={handleConfirmBoarding} 
                  className="btn btn-primary btn-gradient"
                  style={{ padding: '14px 0' }}
                >
                  Check In & Board
                </button>
                <button 
                  onClick={() => { setScanResult(null); setIsScanning(true); }} 
                  className="btn btn-secondary"
                  style={{ padding: '14px 0' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="payment-card" style={{ borderTop: '5px solid var(--danger)', padding: '24px' }}>
              {/* Premium haptic animated danger icon */}
              <div className="validation-icon-scale validation-icon-danger scale-in">✕</div>
              <h3 style={{ color: 'var(--danger)', fontSize: '1.4rem', margin: '0 0 8px 0' }}>ACCESS DENIED</h3>
              <StatusBadge status="failed" />

              <div className="ticket-divider" style={{ margin: '16px 0' }} />

              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--danger)', marginBottom: '6px' }}>
                  Reason: {scanResult.reason}
                </p>
                {scanResult.seats?.length > 0 && (
                  <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    Ticket Seats: {scanResult.seats.join(', ')}
                  </p>
                )}
              </div>

              <button 
                onClick={() => { setScanResult(null); setIsScanning(true); }} 
                className="btn btn-secondary btn-large"
              >
                Dismiss & Continue Scanning
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
