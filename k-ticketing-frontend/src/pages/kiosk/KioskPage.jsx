import { useState, useEffect } from 'react';
import { API } from '../../api';
import SeatGrid from '../../components/SeatGrid';
import BusList from '../../components/BusList';
import { useReservationTimer } from '../../hooks/useReservationTimer';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import StatusBadge from '../../components/StatusBadge';
import CountdownTimer from '../../components/CountdownTimer';

export default function KioskPage() {
  const [step, setStep] = useState(1);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [finalTicket, setFinalTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (step === 1) {
      API.getDestinations()
        .then(setDestinations)
        .catch(err => {
          console.error("Failed to load destinations:", err);
          setErrorMessage("Failed to load destinations. Please try again.");
        });
      setSelectedDest('');
      setSelectedBus(null);
      setSelectedSeats([]);
      setReservation(null);
      setPayment(null);
      setPaymentStatus('pending');
      setFinalTicket(null);
      setErrorMessage('');
    }
  }, [step]);

  const handleSelectDest = async (dest) => {
    try {
      setSelectedDest(dest);
      const today = new Date().toISOString().split('T')[0];
      const busList = await API.getBuses(today, dest);
      setBuses(busList);
      setStep(2);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to retrieve schedules.");
    }
  };

  const handleSelectBus = async (bus) => {
    try {
      setSelectedBus(bus);
      await refreshSeatMap(bus.id);
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load seat map.");
    }
  };

  const refreshSeatMap = async (busId) => {
    try {
      const seatMap = await API.getSeats(busId);
      setSeats(seatMap);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to refresh seat map.");
    }
  };

  const handleSeatToggle = (num) => {
    setSelectedSeats(prev =>
      prev.includes(num) ? prev.filter(x => x !== num) : [...prev, num]
    );
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return;
    try {
      setErrorMessage('');
      const res = await API.reserveSeats(selectedBus.id, selectedSeats);
      setReservation(res);
      setStep(4);
    } catch (err) {
      if (err.status === 409) {
        setErrorMessage("Transaction Conflict: Some seats were claimed by another client.");
        await refreshSeatMap(selectedBus.id);
        setSelectedSeats(prev => prev.filter(id => !err.data.conflictingSeatIds.includes(id)));
      } else {
        setErrorMessage("Reservation failed. Please try again.");
      }
    }
  };

  const handleCancelReservation = async () => {
    try {
      if (reservation) {
        await API.cancelReservation(reservation.reservationId);
      }
    } catch (err) {
      console.error(err);
    }
    setStep(3);
  };

  const timeLeft = useReservationTimer(reservation?.expiresAt, () => {
    if (step === 4) {
      alert("Checkout allocation context limit breached. Returning home.");
      setStep(1);
    }
  });

  const handleTriggerGCash = async () => {
    try {
      setErrorMessage('');
      const amount = selectedSeats.length * selectedBus.seatPrice;
      const payObj = await API.initiatePayment(reservation.reservationId, amount);
      setPayment(payObj);
      setPaymentStatus('pending');
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to initiate GCash payment.");
    }
  };

  usePaymentPolling(payment?.paymentId, paymentStatus, async (newStatus) => {
    setPaymentStatus(newStatus);
    if (newStatus === 'paid') {
      try {
        const ticket = await API.createTicket(reservation.reservationId, 'gcash', payment.paymentId);
        setFinalTicket(ticket);
        setStep(5);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to finalize GCash ticket.");
      }
    } else if (newStatus === 'failed') {
      setErrorMessage("Transaction failed on provider backend.");
    }
  });

  const handleCashCheckout = async () => {
    try {
      setErrorMessage('');
      const ticket = await API.createTicket(reservation.reservationId, 'cash');
      setFinalTicket(ticket);
      setStep(5);
    } catch (err) {
      if (err.status === 410) {
        alert("Reservation expired before cash confirmation processed.");
      } else {
        setErrorMessage("Failed to finalize Cash ticket.");
      }
      setStep(1);
    }
  };

  return (
    <div className="mobile-container" style={{ maxWidth: '640px' }}>
      <header className="app-header">
        <h1>SELF-SERVICE KIOSK</h1>
        <p className="app-subtitle">Terminal Booking Kiosk</p>
      </header>

      {errorMessage && (
        <div className="alert alert-error fade-in" role="alert">
          {errorMessage}
        </div>
      )}

      {step === 1 && (
        <div className="fade-in">
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Where are you traveling today?</h2>
          <div className="destination-list">
            {destinations.map(d => (
              <button key={d} onClick={() => handleSelectDest(d)} className="btn btn-dest btn-gradient">
                {d}
              </button>
            ))}
            {destinations.length === 0 && !errorMessage && <p className="loading-text">Loading departure destinations...</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <h2 style={{ textAlign: 'center' }}>Select Departure Schedule to {selectedDest}</h2>
          <BusList buses={buses} onSelectBus={handleSelectBus} />
          <button onClick={() => setStep(1)} className="btn btn-secondary btn-large mt-20">
            Back to Destinations
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in">
          <h2 style={{ textAlign: 'center' }}>Choose Your Seats</h2>
          <div className="button-group">
            <button onClick={() => refreshSeatMap(selectedBus.id)} className="btn btn-small btn-secondary">
              Refresh Map Manually
            </button>
          </div>

          <SeatGrid seats={seats} selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary btn-large">
              Back to Schedules
            </button>
          </div>

          <div className={`floating-bar ${selectedSeats.length > 0 ? 'floating-bar-active' : ''}`}>
            <div className="floating-bar-content">
              <div className="floating-seats-details">
                <span className="floating-label">Selected Seats</span>
                <span className="floating-values">{selectedSeats.join(', ') || 'None'}</span>
              </div>
              <div className="floating-price-details">
                <span className="floating-label">Total Price</span>
                <span className="floating-price">₱{(selectedSeats.length * selectedBus.seatPrice).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleReserve} disabled={selectedSeats.length === 0} className="btn btn-primary btn-gradient btn-large">
              Confirm Seats & Checkout
            </button>
          </div>

          <div style={{ height: '220px', width: '100%' }} aria-hidden="true"></div>
        </div>
      )}

      {step === 4 && (
        <div className="fade-in">
          <div className="checkout-amount-block">
            <div className="fintech-amount" style={{ color: '#0f172a', marginBottom: '8px' }}>
              ₱{(selectedSeats.length * selectedBus.seatPrice).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span className="checkout-timer-inline">
                ⏱ Expires in <span className="timer-countdown">{timeLeft}</span>
              </span>
            </div>
          </div>

          <div className="checkout-panels-grid">
            <div className="checkout-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>📱</span>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>GCash / QR</h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
                Scan the PayMongo QR with your mobile to complete payment.
              </p>
              {!payment ? (
                <button onClick={handleTriggerGCash} className="btn btn-primary btn-gradient btn-large">
                  Generate QR
                </button>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <div className="qr-container">
                    <img src={payment.qrImageUrl} alt="PayMongo QR" className="payment-qr" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500 }}>Status:</span>
                    <StatusBadge status={paymentStatus} />
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>💵</span>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>Cash Acceptor</h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
                Insert bills into the pulsing slot. Terminal confirms and prints ticket.
              </p>
              <div className="cash-slot-wrapper" onClick={handleCashCheckout} style={{ cursor: 'pointer' }}>
                <div className="cash-slot-label">Terminal Cash</div>
                <div className="cash-slot-opening" />
                <button className="btn btn-secondary btn-large mt-10" style={{ pointerEvents: 'none', border: '1px solid var(--success)', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.82rem' }}>
                  Tap to Insert &amp; Print
                </button>
              </div>
            </div>
          </div>

          <button onClick={handleCancelReservation} className="btn btn-secondary btn-large mt-20">
            Cancel &amp; Return
          </button>
        </div>
      )}

      {step === 5 && finalTicket && (
        <div className="fade-in">
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Ticket Issued Successfully!</h2>
          </div>

          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-route">
                <span className="ticket-route-city">P2P</span>
                <span className="ticket-route-arrow">➜</span>
                <span className="ticket-route-city">{finalTicket.destination.toUpperCase()}</span>
              </div>
              <p>{finalTicket.departureDate}</p>
            </div>

            <div className="ticket-punch-container" aria-hidden="true">
              <div className="ticket-punch-left" />
              <div className="ticket-punch-line" />
              <div className="ticket-punch-right" />
            </div>

            <div className="ticket-body">
              <div className="ticket-row">
                <span>Departure Time</span>
                <strong>{finalTicket.departureTime}</strong>
              </div>
              <div className="ticket-row">
                <span>Passenger Count</span>
                <strong>{finalTicket.passengerCount} Pax</strong>
              </div>
              <div className="ticket-row">
                <span>Seats Allocated</span>
                <strong>{finalTicket.seats.join(', ')}</strong>
              </div>
              <div className="ticket-row">
                <span>Payment Method</span>
                <strong>{finalTicket.paymentMethod.toUpperCase()}</strong>
              </div>
              <div className="ticket-row">
                <span>Total Amount</span>
                <strong>₱{finalTicket.totalAmount.toFixed(2)}</strong>
              </div>

              <hr className="ticket-divider" />

              <div className="ticket-qr-section">
                <QRCodeDisplay value={finalTicket.qrCode} />
                <p className="ticket-id">Ticket ID: {finalTicket.ticketId}</p>
              </div>
            </div>
          </div>

          <div className="mt-30">
            <CountdownTimer initialSeconds={30} onTimeout={() => setStep(1)} label="Returning to start screen in" />
          </div>
          <button onClick={() => setStep(1)} className="btn btn-secondary btn-large mt-10 mb-40">
            Return Immediately
          </button>
        </div>
      )}
    </div>
  );
}
