import { useState, useEffect } from 'react';
import { API } from '../../api';
import SeatGrid from '../../components/SeatGrid';
import BusList from '../../components/BusList';
import { useReservationTimer } from '../../hooks/useReservationTimer';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import StatusBadge from '../../components/StatusBadge';

export default function BookPage() {
  const [step, setStep] = useState(1); // 1: Dest, 2: Bus, 3: Seats, 4: Pay, 5: Ticket
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

  // Fetch unique destinations on mount/return to start
  useEffect(() => {
    if (step === 1) {
      API.getDestinations()
        .then(setDestinations)
        .catch(err => {
          console.error("Failed to load destinations:", err);
          setErrorMessage("Failed to load destinations. Please try again.");
        });
      // Reset state for new booking flow
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
      setErrorMessage("Failed to retrieve schedule for selected destination.");
    }
  };

  const handleSelectBus = async (bus) => {
    try {
      setSelectedBus(bus);
      await refreshSeatMap(bus.id);
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load seat layout.");
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
      console.error("Cancel reservation failed:", err);
    }
    setStep(3);
  };

  // Timer Expiry Callback Hook trigger
  const timeLeft = useReservationTimer(reservation?.expiresAt, () => {
    if (step === 4) {
      alert("Reservation time limit exceeded. Returning home.");
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
        setErrorMessage("Failed to finalize booking. Please contact support.");
      }
    } else if (newStatus === 'failed') {
      setErrorMessage("GCash Payment failed on provider backend.");
    }
  });

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>BUS BOOKING</h1>
        <p className="app-subtitle">Passenger Web App</p>
      </header>

      {/* Isolated error banner - always above step content, never clips */}
      {errorMessage && (
        <div className="alert alert-error fade-in" role="alert">
          {errorMessage}
        </div>
      )}

      {step === 1 && (
        <div className="fade-in">
          <h2>Select Destination</h2>
          <div className="destination-list">
            {destinations.map(d => (
              <button key={d} onClick={() => handleSelectDest(d)} className="btn btn-dest btn-gradient">
                {d}
              </button>
            ))}
            {destinations.length === 0 && !errorMessage && <p className="loading-text">Loading destinations...</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <h2>Select Schedule to {selectedDest}</h2>
          <BusList buses={buses} onSelectBus={handleSelectBus} />
          <button onClick={() => setStep(1)} className="btn btn-secondary mt-20" style={{ width: '100%' }}>
            Back
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in">
          <h2>Select Seats</h2>
          <div className="button-group">
            <button onClick={() => refreshSeatMap(selectedBus.id)} className="btn btn-small btn-secondary">
              Refresh Seat Map
            </button>
          </div>
          
          <SeatGrid seats={seats} selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ width: '100%' }}>
              Back to Schedules
            </button>
          </div>

          {/* Cinema style slide-up floating checkout bar */}
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
        </div>
      )}

      {step === 4 && (
        <div className="fade-in">
          {/* Compact inline amount + timer block */}
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

          {/* Fix 5: Elegant checkout panel with fintech typography */}
          <div className="checkout-panel" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>📱</span>
              <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1rem' }}>Pay with GCash</h3>
            </div>

            {!payment ? (
              <button onClick={handleTriggerGCash} className="btn btn-primary btn-gradient btn-large">
                Generate GCash Invoice
              </button>
            ) : (
              <div className="gcash-payment-info">
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>Scan this QR or tap the link below to pay via PayMongo:</p>
                <div className="qr-container">
                  <img src={payment.qrImageUrl} alt="GCash Sandbox QR" className="payment-qr" />
                </div>

                <a href={payment.redirectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-gradient btn-large mt-20" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Proceed to GCash Checkout
                </a>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '14px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Payment Status:</span>
                  <StatusBadge status={paymentStatus} />
                </div>
              </div>
            )}
          </div>

          <button onClick={handleCancelReservation} className="btn btn-secondary btn-large">
            Cancel Reservation
          </button>
        </div>
      )}

      {step === 5 && finalTicket && (
        <div className="fade-in">
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Booking Confirmed!</h2>
          </div>

          <div className="screenshot-alert alert alert-warning">
            <p><strong>IMPORTANT:</strong> Please take a screenshot of this ticket now. You will need to show this QR code to the conductor when boarding.</p>
          </div>

          {/* Apple Wallet Transit Pass Card */}
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

          <button onClick={() => setStep(1)} className="btn btn-primary btn-gradient btn-large mt-20 mb-40">
            Book Another Journey
          </button>
        </div>
      )}
    </div>
  );
}
