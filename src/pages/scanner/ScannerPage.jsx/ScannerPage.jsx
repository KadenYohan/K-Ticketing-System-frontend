import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { API } from '../../api';

export default function ScannerPage() {
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(() => sessionStorage.getItem('conductor_bus_id') || '');
  const [scanResult, setScanResult] = useState(null); // null, or verification model object payload
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Fetch all active buses for today without route filtering
    API.getBuses(today, '').then(setActiveBuses).catch(console.error);
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
          // Injection parameters required for follow-up state transaction hooks
          setScanResult({ ...validation, ticketId: decodedText });
        } catch (err) {
          setScanResult({ valid: false, reason: "System communication failure.", seats: [] });
        }
      };

      scannerRef.current.render(onScanSuccess, (err) => {});
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [selectedBusId, isScanning, scanResult]);

  const handleConfirmBoarding = async () => {
    if (!scanResult) return;
    await API.checkInTicket(scanResult.ticketId, selectedBusId);
    alert("Boarding Confirmed!");
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>CONDUCTOR BOARDING CONTROL</h2>
      
      <label style={{ display: 'block', marginBottom: '15px' }}>
        <strong>Select Your Assigned Bus Run:</strong>
        <select value={selectedBusId} onChange={handleBusSelectionChange} style={{ display: 'block', width: '100%', padding: '12px', marginTop: '5px' }}>
          <option value="">-- Choose Bus Run --</option>
          {activeBuses.map(b => (
            <option key={b.id} value={b.id}>{b.destination} @ {b.departureTime} ({b.status})</option>
          ))}
        </select>
      </label>

      {selectedBusId && !scanResult && !isScanning && (
        <button onClick={() => setIsScanning(true)} style={{ width: '100%', padding: '15px', background: '#00cc44', color: '#fff', fontSize: '16px', border: 'none', borderRadius: '4px' }}>
          Activate Camera Engine Scanner
        </button>
      )}

      <div id="reader" style={{ width: '100%', margin: '10px 0' }}></div>

      {scanResult && (
        <div style={{ border: '3px solid', borderColor: scanResult.valid ? '#2e7d32' : '#c62828', background: scanResult.valid ? '#e8f5e9' : '#ffebee', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
          {scanResult.valid ? (
            <div>
              <h3 style={{ color: '#2e7d32', margin: '0 0 10px 0' }}>TICKET VALID</h3>
              <p style={{ fontSize: '24px', margin: '10px 0' }}>Seats: <strong>{scanResult.seats.join(', ')}</strong></p>
              <p>Total Unboarded Passengers Remaining: <strong>{scanResult.remainingUnboarded}</strong></p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleConfirmBoarding} style={{ flex: 1, padding: '15px', background: '#2e7d32', color: '#fff', fontSize: '16px', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                  Check In & Board
                </button>
                <button onClick={() => { setScanResult(null); setIsScanning(true); }} style={{ padding: '15px', background: '#757575', color: '#fff', border: 'none', borderRadius: '4px' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#c62828', margin: '0 0 10px 0' }}>ACCESS DENIED</h3>
              <p style={{ fontWeight: 'bold' }}>Reason: {scanResult.reason}</p>
              {scanResult.seats?.length > 0 && <p>Ticket Seats: {scanResult.seats.join(', ')}</p>}
              <button onClick={() => { setScanResult(null); setIsScanning(true); }} style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#757575', color: '#fff', border: 'none', borderRadius: '4px' }}>
                Dismiss & Continue Scanning
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}