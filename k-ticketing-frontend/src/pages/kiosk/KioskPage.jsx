import React, { useState, useEffect } from 'react';
import { API } from '../../api';
import SeatGrid from '../../components/SeatGrid';
import { useReservationTimer } from '../../hooks/useReservationTimer';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import QRCodeDisplay from '../../components/QRCodeDisplay';

export default function KioskPage() {
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

  // Step 1: Initial Hook load
  useEffect(() => {
    if (step === 1) {
      API.getDestinations().then(setDestinations).catch(console.error);
      // Clear transactional garbage collection arrays
      setSelectedDest(''); setSelectedBus(null); setSelectedSeats([]); setReservation(null); setPayment(null); setPaymentStatus('pending'); setFinalTicket(null); setErrorMessage('');
    }
  }, [step]);

  const handleSelectDest = async (dest) => {
    setSelectedDest(dest);
    const today = new Date().toISOString().split('T')[0];
    const busList = await API.getBuses(today, dest);
    setBuses(busList);
    setStep(2);
  };

  const handleSelectBus = async (bus) => {
    setSelectedBus(bus);
    await refreshSeatMap(bus.id);
    setStep(3);
  };

  const refreshSeatMap = async (busId) => {
    const seatMap = await API.getSeats(busId);
    setSeats(seatMap);
  };

  const handleSeatToggle = (num) => {
    setSelectedSeats(prev => prev.includes(num) ? prev.filter(x => x !== num) : [...prev, num]);
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const res = await API.reserveSeats(selectedBus.id, selectedSeats);
      setReservation(res);
      setStep(4);
    } catch (err) {
      if (err.status === 409) {
        setErrorMessage("Transaction Conflict: Some seats were claimed by another client.");
        await refreshSeatMap(selectedBus.id);
        // Retain only those items within user choices still verified open
        setSelectedSeats(prev => prev.filter(id => !err.data.conflictingSeatIds.includes(id)));
      }
    }
  };

  const handleCancelReservation = async () => {
    if (reservation) {
      await API.cancelReservation(reservation.reservationId);
    }
    setStep(3);
  };

  // Timer Expiry Callback Hook trigger
  const timeLeft = useReservationTimer(reservation?.expiresAt, () => {
    if (step === 4) {
      alert("Checkout allocation context limit breached. Returning home.");
      setStep(1);
    }
  });

  const handleTriggerGCash = async () => {
    const amount = selectedSeats.length * selectedBus.seatPrice;
    const payObj = await API.initiatePayment(reservation.reservationId, amount);
    setPayment(payObj);
    setPaymentStatus('pending');
  };

  usePaymentPolling(payment?.paymentId, paymentStatus, async (newStatus) => {
    setPaymentStatus(newStatus);
    if (newStatus === 'paid') {
      const ticket = await API.createTicket(reservation.reservationId, 'gcash', payment.paymentId);
      setFinalTicket(ticket);
      setStep(5);
    } else if (newStatus === 'failed') {
      setErrorMessage("Transaction failed on provider backend API registry.");
    }
  });

  const handleCashCheckout = async () => {
    try {
      const ticket = await API.createTicket(reservation.reservationId, 'cash');
      setFinalTicket(ticket);
      setStep(5);
    } catch (err) {
      if (err.status === 410) alert("Reservation expired before cash confirmation processed.");
      setStep(1);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>K-TICKETING TERMINAL KIOSK</h1>
      {errorMessage && <div style={{ background: '#ffeb3b', padding: '10px', margin: '15px' }}>{errorMessage}</div>}

      {step === 1 && (
        <div>
          <h2>Where are you traveling today?</h2>
          {destinations.map(d => <button key={d} onClick={() => handleSelectDest(d)} style={{ margin: '10px', padding: '20px 40px', fontSize: '18px' }}>{d}</button>)}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Select Departure Schedule to {selectedDest}</h2>
          {buses.map(b => (
            <div key={b.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px auto', maxWidth: '500px' }}>
              <p>Departure: <strong>{b.departureTime}</strong> | PHP {b.seatPrice}</p>
              <p>Available Seats: {b.seatsAvailable} / 50</p>
              <button onClick={() => handleSelectBus(b)}>Select This Bus</button>
            </div>
          ))}
          <button onClick={() => setStep(1)} style={{ marginTop: '20px' }}>Back</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Choose Your Seats ({selectedSeats.length} Selected)</h2>
          <button onClick={() => refreshSeatMap(selectedBus.id)}>Refresh Map Manually</button>
          <SeatGrid seats={seats} selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
          <button onClick={handleReserve} style={{ padding: '15px', fontSize: '16px', background: '#2196f3', color: 'white' }}>Proceed to Payment</button>
          <button onClick={() => setStep(2)}>Back</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Payment Gate — Holding Allocation Vector: <span style={{ color: 'red' }}>{timeLeft}</span></h2>
          <h3>Total Payable: ₱{selectedSeats.length * selectedBus.seatPrice}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
            <div style={{ border: '1px solid #aaa', padding: '20px', borderRadius: '8px' }}>
              <h4>Option A: Pay with GCash</h4>
              {!payment ? (
                <button onClick={handleTriggerGCash}>Generate GCash Secure QR Code</button>
              ) : (
                <div>
                  <p>Scan this QR code with your mobile device to open the sandbox payment interface:</p>
                  <img src={payment.qrImageUrl} alt="PayMongo Gateway QR String payload" style={{ width: '150px', height: '150px' }} />
                  <p>Status: <strong>{paymentStatus.toUpperCase()}</strong></p>
                </div>
              )}
            </div>

            <div style={{ border: '1px solid #aaa', padding: '20px', borderRadius: '8px' }}>
              <h4>Option B: Cash Payment (Simulated Checkout)</h4>
              <p>Hand cash directly to terminal desk personnel before executing this transaction step.</p>
              <button onClick={handleCashCheckout} style={{ padding: '15px', background: '#4caf50', color: 'white', fontWeight: 'bold' }}>
                I have paid ₱{selectedSeats.length * selectedBus.seatPrice} in cash – Print Ticket
              </button>
            </div>
          </div>
          <button onClick={handleCancelReservation} style={{ marginTop: '30px' }}>Cancel Order & Return</button>
        </div>
      )}

      {step === 5 && finalTicket && (
        <div>
          <h2 style={{ color: '#4caf50' }}>Ticket Purchased Successfully!</h2>
          <div style={{ border: '2px dashed #000', padding: '30px', margin: '20px auto', maxWidth: '400px', background: '#fff9c4' }}>
            <h3>DESTINATION: {finalTicket.destination}</h3>
            <p>Departure: <strong>{finalTicket.departureTime}</strong> on {finalTicket.departureDate}</p>
            <p>Seats Allocated: {finalTicket.seats.join(', ')}</p>
            <p>Total Count: {finalTicket.passengerCount} Pax</p>
            <p>Method: {finalTicket.paymentMethod.toUpperCase()}</p>
            <hr />
            <QRCodeDisplay value={finalTicket.qrCode} />
          </div>
          <KioskTimeoutClock onDone={() => setStep(1)} />
        </div>
      )}
    </div>
  );
}

// Internal Post-Checkout System Return Counter Component
function KioskTimeoutClock({ onDone }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(p => {
        if (p <= 1) { clearInterval(timer); onDone(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div>
      <p>Returning to default startup matrix window in {seconds} seconds...</p>
      <button onClick={onDone} style={{ padding: '10px 20px' }}>Return to Start Immediately</button>
    </div>
  );
}
