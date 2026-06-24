import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, RefreshCw, Check, Clock, MapPin, AlertCircle, Ticket, Download } from 'lucide-react';
import { API } from '../../api/index';
import { useReservationTimer } from '../../hooks/useReservationTimer';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import { SeatGrid } from './SeatGrid';
import { QRCode } from './QRCode';
import { DESTINATIONS, type Destination, type Bus, type Seat } from '../data/mockData';

// ── Translated UI Types ─────────────────────────────────────────────────────────
interface ApiTicket { ticketId: string; destination: string; departureTime: string; departureDate: string; seats: string[]; passengerCount: number; totalAmount: number; paymentMethod: string; qrCode: string; }

const STEPS = ['Destination', 'Bus', 'Seats', 'Payment', 'Ticket'];

function StepProgress({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = current > stepNum;
        const active = current === stepNum;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#D4A800' : active ? '#D4A800' : '#E5E4E7',
                border: active ? '3px solid rgba(212, 168, 0,0.35)' : done ? '3px solid transparent' : '2px solid #E5E4E7',
                color: done || active ? '#fff' : '#9CA3AF',
                fontSize: 14, fontWeight: 700,
                boxShadow: active ? '0 0 0 4px rgba(212, 168, 0,0.15)' : undefined,
                transition: 'all 0.3s',
              }}>
                {done ? <Check size={16} /> : stepNum}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: done || active ? '#D4A800' : '#9CA3AF', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 'clamp(24px, 4vw, 64px)', height: 2, margin: '0 4px', marginBottom: 20,
                background: done ? '#D4A800' : '#E5E4E7', transition: 'background 0.4s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({ onSelect }: { onSelect: (dest: Destination) => void }) {
  const [dests, setDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getDestinations().then((apiDests: string[]) => {
      const mapped = apiDests.map(name => {
        const visual = DESTINATIONS.find(d => d.name === name);
        return visual || { id: name, name, fullRoute: name, duration: 'N/A', priceFrom: 0 };
      });
      setDests(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 8 }}>Where are you traveling today?</h2>
      <p style={{ fontSize: 16, color: '#6B6375', marginBottom: 40, lineHeight: 1.6 }}>Select your destination to see available buses.</p>
      {loading ? (
        <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>Loading destinations…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {dests.map(dest => (
            <motion.button
              key={dest.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(dest)}
              style={{
                padding: 24, borderRadius: 16, border: '1.5px solid #E5E4E7',
                background: '#fff', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 168, 0,0.5)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E4E7'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212, 168, 0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="#D4A800" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{dest.name}</span>
              </div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 12 }}>Book a seat from the terminal</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#D4A800' }}>View departures →</div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function BusStatusBadge({ status, available }: { status: string; available: number }) {
  if (status === 'departed') return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(107,99,117,0.1)', color: '#6B6375', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Departed</span>
  );
  if (available === 0) return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#EF4444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sold Out</span>
  );
  if (available <= 5) return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Almost Full</span>
  );
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Scheduled</span>
  );
}

function Step2({ destination, onSelect, onBack }: { destination: Destination; onSelect: (bus: Bus) => void; onBack: () => void }) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    API.getBuses(today, destination.name).then((data: any[]) => {
      const mapped: Bus[] = data.map(b => ({
        id: b.id,
        destinationId: b.destination,
        destination: b.destination,
        route: '',
        departure: b.departureTime,
        price: b.seatPrice,
        capacity: b.seatsAvailable + (b.seatsReserved || 0) + (b.seatsBooked || 0),
        available: b.seatsAvailable,
        reserved: b.seatsReserved || 0,
        booked: b.seatsBooked || 0,
        boarded: 0,
        status: b.status,
        date: b.date || today,
      }));
      setBuses(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [destination.name]);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, fontWeight: 500, marginBottom: 24, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Destinations
      </button>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 4 }}>
        Departures to {destination.name}
      </h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 32 }}>June 23, 2026 — Select your preferred departure time</p>
      
      {loading ? (
        <div style={{ color: '#9CA3AF', padding: 40 }}>Loading schedules...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {buses.map(bus => {
            const isUnavailable = bus.status === 'departed' || bus.available === 0;
            return (
              <motion.div
                key={bus.id}
                whileHover={!isUnavailable ? { y: -2 } : {}}
                style={{
                  padding: '20px 24px', borderRadius: 12, border: '1.5px solid #E5E4E7',
                  background: isUnavailable ? '#F9F8FD' : '#fff',
                  opacity: isUnavailable ? 0.65 : 1, transition: 'all 0.2s',
                  cursor: isUnavailable ? 'default' : 'pointer',
                }}
                onClick={() => !isUnavailable && onSelect(bus)}
                onMouseEnter={e => { if (!isUnavailable) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 168, 0,0.5)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E4E7'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 2 }}>DEPARTURE</div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{bus.departure}</div>
                    </div>
                    <div style={{ width: 1, height: 40, background: '#E5E4E7' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 2 }}>AVAILABLE</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: bus.available <= 5 ? '#F59E0B' : '#22C55E' }}>
                        {bus.available} <span style={{ fontSize: 13, fontWeight: 500, color: '#9CA3AF' }}>/ {bus.capacity} seats</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#D4A800' }}>₱{bus.price}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>per seat</div>
                    </div>
                    <BusStatusBadge status={bus.status} available={bus.available} />
                    {!isUnavailable && (
                      <button style={{
                        padding: '10px 20px', borderRadius: 8, background: '#D4A800', color: '#fff',
                        border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                      }}>
                        Select →
                      </button>
                    )}
                  </div>
                </div>
                {/* Occupancy bar */}
                <div style={{ marginTop: 12, height: 4, background: '#E5E4E7', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999, transition: 'width 0.5s',
                    background: bus.available <= 5 ? '#F59E0B' : '#D4A800',
                    width: `${((bus.capacity - bus.available) / Math.max(1, bus.capacity)) * 100}%`,
                  }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function Step3({
  bus, destination, selectedSeats, onSeatToggle, onRefresh, onProceed, onBack, conflictError,
}: {
  bus: Bus; destination: Destination; selectedSeats: string[]; onSeatToggle: (seat: Seat) => void;
  onRefresh: () => void; onProceed: () => void; onBack: () => void; conflictError?: string;
}) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  const fetchSeats = () => {
    setLoadingSeats(true);
    API.getSeats(bus.id).then((data: any[]) => {
      const mapped: Seat[] = data.map(s => {
        const row = parseInt(s.seatNumber.match(/\d+/)?.[0] || '0', 10);
        const col = s.seatNumber.replace(/[0-9]/g, '') as any;
        return {
          id: s.seatId,
          row, col,
          label: s.seatNumber,
          status: s.status,
        };
      });
      setSeats(mapped);
      setLoadingSeats(false);
    }).catch(() => setLoadingSeats(false));
  };

  useEffect(() => { fetchSeats(); }, [bus.id]);

  const handleRefresh = () => { fetchSeats(); onRefresh(); toast.success('Seat map refreshed'); };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, marginBottom: 24, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Bus Selection
      </button>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 32 }}>
        Choose Your Seats
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }} className="seat-layout">
        {/* Left: seat grid */}
        <div style={{ background: '#F9F8FD', borderRadius: 16, padding: 24, border: '1px solid #E5E4E7' }}>
          {conflictError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} color="#EF4444" />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>{conflictError}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{destination.name}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF' }}>Departure: {bus.departure}</div>
            </div>
            <button
              onClick={handleRefresh}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E4E7', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#6B6375' }}
            >
              <RefreshCw size={14} /> Refresh Map
            </button>
          </div>
          {loadingSeats ? (
            <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>Loading seats…</div>
          ) : (
            <SeatGrid
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={onSeatToggle}
            />
          )}
        </div>

        {/* Right: Summary panel */}
        <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E4E7', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #E5E4E7' }}>
              Trip Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Destination</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{destination.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Departure</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{bus.departure}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Price/seat</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>₱{bus.price}</span>
              </div>
            </div>

            <div style={{ background: '#F9F8FD', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #E5E4E7' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Selected Seats</div>
              {selectedSeats.length === 0 ? (
                <p style={{ fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' }}>No seats selected yet</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {selectedSeats.map(s => (
                    <span key={s} style={{ padding: '4px 10px', borderRadius: 8, background: '#3B82F6', color: '#fff', fontSize: 13, fontWeight: 700 }}>{s}</span>
                  ))}
                </div>
              )}
              <div style={{ height: 1, background: '#E5E4E7', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#D4A800' }}>₱{selectedSeats.length * bus.price}</span>
              </div>
            </div>

            <button
              onClick={onProceed}
              disabled={selectedSeats.length === 0}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 10,
                background: selectedSeats.length === 0 ? '#E5E4E7' : '#D4A800',
                color: selectedSeats.length === 0 ? '#9CA3AF' : '#fff',
                border: 'none', cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: 15, fontWeight: 700, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Proceed to Payment <ArrowRight size={16} />
            </button>
            {selectedSeats.length === 0 && (
              <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>Select at least one seat to continue</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CountdownBar({ expiresAt }: { expiresAt: number }) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      const r = expiresAt - Date.now();
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const total = 5 * 60 * 1000;
  const pct = Math.max(0, (remaining / total) * 100);
  const mins = Math.max(0, Math.floor(remaining / 60000));
  const secs = Math.max(0, Math.floor((remaining % 60000) / 1000));
  const isRed = remaining < 60000;
  const isAmber = remaining < 2 * 60000;
  const barColor = isRed ? '#EF4444' : isAmber ? '#F59E0B' : '#22C55E';

  return (
    <div style={{ background: isRed ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)', border: `1px solid ${isRed ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} color={barColor} />
          <span style={{ fontSize: 14, fontWeight: 600, color: isRed ? '#EF4444' : '#0f172a' }}>Reservation expires in</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: barColor }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      <div style={{ height: 6, background: '#E5E4E7', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width 1s linear, background 0.5s' }} />
      </div>
    </div>
  );
}

function Step4({
  bus, destination, selectedSeats, reservation, onConfirm, onCancel,
}: {
  bus: Bus; destination: Destination; selectedSeats: string[];
  reservation: { reservationId: string; expiresAt: string } | null;
  onConfirm: (ticket: ApiTicket) => void; onCancel: () => void;
}) {
  const [payment, setPayment] = useState<{ paymentId: string; qrImageUrl: string; redirectUrl: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'paid' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const total = selectedSeats.length * bus.price;

  // Real reservation timer from server expiresAt
  useReservationTimer(reservation?.expiresAt, () => {
    toast.error('Reservation expired. Please start again.');
    onCancel();
  });

  // Real payment polling
  usePaymentPolling(payment?.paymentId, paymentStatus, async (newStatus: string) => {
    setPaymentStatus(newStatus as any);
    if (newStatus === 'paid' && reservation) {
      try {
        const ticket = await API.createTicket(reservation.reservationId, 'gcash', payment?.paymentId);
        toast.success('Payment confirmed! Your ticket is ready.');
        onConfirm(ticket);
      } catch { setErrorMsg('Failed to create ticket after payment. Please contact staff.'); }
    } else if (newStatus === 'failed') {
      setErrorMsg('Payment failed. Please try again or contact staff.');
    }
  });

  const handleGenerate = async () => {
    if (!reservation) return;
    try {
      const payObj = await API.initiatePayment(reservation.reservationId, total);
      setPayment(payObj);
      setPaymentStatus('pending');
    } catch { setErrorMsg('Failed to initiate GCash payment. Please try again.'); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
      {reservation && <CountdownBar expiresAt={new Date(reservation.expiresAt).getTime()} />}
      {errorMsg && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8 }}>
          <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, color: '#EF4444' }}>{errorMsg}</span>
        </div>
      )}

      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>Complete Payment</h2>
      <p style={{ fontSize: 15, color: '#6B6375', marginBottom: 32 }}>
        {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} to {destination.name} @ {bus.departure}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }} className="payment-layout">
        {/* GCash panel */}
        <div style={{ background: 'rgba(0,125,255,0.04)', border: '1.5px solid rgba(0,125,255,0.2)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#007DFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>G</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Pay with GCash</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>Via PayMongo — instant confirmation</div>
            </div>
          </div>

          {!payment ? (
            <div>
              <div style={{ padding: '20px', background: 'rgba(0,125,255,0.06)', borderRadius: 12, textAlign: 'center', marginBottom: 20 }}>
                <p style={{ fontSize: 15, color: '#6B6375', lineHeight: 1.7 }}>Click below to generate your GCash payment QR code. You'll have 5 minutes to complete the payment.</p>
              </div>
              <button
                onClick={handleGenerate}
                style={{
                  width: '100%', padding: '16px', borderRadius: 10, background: '#007DFF', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,125,255,0.35)',
                }}
              >
                Generate GCash QR Code
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: '#6B6375', marginBottom: 20, lineHeight: 1.6 }}>
                Scan this QR code in your GCash app, or tap "Open GCash Checkout" on your phone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                {payment.qrImageUrl.startsWith('data:image') ? (
                  <img src={payment.qrImageUrl} alt="GCash QR" style={{ width: 200, height: 200 }} />
                ) : (
                  <QRCode value={payment.qrImageUrl} size={200} />
                )}
              </div>
              <a href={payment.redirectUrl} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', padding: '14px', borderRadius: 10, background: '#007DFF', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 15, fontWeight: 700, marginBottom: 12, boxSizing: 'border-box' }}>
                Open GCash Checkout →
              </a>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Payment Status:</span>
                <AnimatePresence mode="wait">
                  {paymentStatus === 'pending' && (
                    <motion.div key="pending" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                        <Clock size={13} color="#F59E0B" />
                      </motion.div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.5px' }}>PENDING PAYMENT</span>
                    </motion.div>
                  )}
                  {paymentStatus === 'paid' && (
                    <motion.div key="paid" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      <Check size={13} color="#22C55E" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', letterSpacing: '0.5px' }}>PAID</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div style={{ background: '#F9F8FD', borderRadius: 16, padding: 24, border: '1px solid #E5E4E7' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Route</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: 160 }}>→ {bus.destination}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Departure</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{bus.departure}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>Seats</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{selectedSeats.join(', ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B6375' }}>×{selectedSeats.length} seats @ ₱{bus.price}</span>
                <span style={{ fontSize: 14, color: '#0f172a' }}>₱{total}</span>
              </div>
            </div>
            <div style={{ height: 1, background: '#E5E4E7', marginBottom: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#D4A800' }}>₱{total}</span>
            </div>
          </div>

          <button
            onClick={onCancel}
            style={{
              width: '100%', marginTop: 12, padding: '12px', borderRadius: 10, background: 'transparent',
              color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            }}
          >
            Cancel Reservation & Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Step5({
  ticket, onBookAnother,
}: {
  ticket: ApiTicket; onBookAnother: () => void;
}) {
  const total = ticket.totalAmount;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.12)',
            border: '3px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Check size={36} color="#22C55E" strokeWidth={3} />
        </motion.div>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 16, color: '#22C55E', fontWeight: 600 }}>Your seats have been reserved and payment is complete.</p>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Ticket card */}
        <div style={{
          background: '#fff', borderRadius: 24, border: '2px dashed #E5E4E7',
          boxShadow: '0 20px 48px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {/* Ticket header */}
          <div style={{ background: 'linear-gradient(135deg, #D4A800, #e6b800)', padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>K-TICKETING TICKET</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>K-Ticketing</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <ArrowRight size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{ticket.destination}</span>
            </div>
          </div>

          {/* Notch / perforation */}
          <div style={{ position: 'relative', height: 0 }}>
            <div style={{ position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: '50%', background: '#F9F8FD' }} />
            <div style={{ position: 'absolute', right: -20, top: -20, width: 40, height: 40, borderRadius: '50%', background: '#F9F8FD' }} />
          </div>

          {/* Ticket body */}
          <div style={{ padding: '28px 28px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: 24 }}>
              {[
                { label: 'DATE', value: ticket.departureDate },
                { label: 'DEPARTURE', value: ticket.departureTime },
                { label: 'SEATS', value: ticket.seats.join(', ') },
                { label: 'PASSENGERS', value: `${ticket.passengerCount} Pax` },
                { label: 'PAYMENT', value: ticket.paymentMethod.toUpperCase() + ' ✓' },
                { label: 'AMOUNT', value: `₱${total}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, borderTop: '2px dashed #E5E4E7', marginBottom: 24 }} />

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <QRCode value={ticket.qrCode} size={180} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: 4 }}>TICKET ID</div>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#6B6375' }}>{ticket.ticketId}</div>
              </div>
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>
                Present this QR code to the conductor to board your bus.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.15)' }}>
            <Download size={16} color="#3B82F6" />
            <span style={{ fontSize: 14, color: '#3B82F6', fontWeight: 500 }}>
              Take a screenshot to save your ticket — or find it via <strong>My Tickets</strong>.
            </span>
          </div>
          <button
            onClick={onBookAnother}
            style={{
              padding: '14px', borderRadius: 10, background: '#D4A800', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
              boxShadow: '0 4px 16px rgba(212, 168, 0,0.3)',
            }}
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [bus, setBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservation, setReservation] = useState<{ reservationId: string; expiresAt: string } | null>(null);
  const [ticket, setTicket] = useState<ApiTicket | null>(null);
  const [conflictError, setConflictError] = useState('');
  const [reserving, setReserving] = useState(false);

  const handleSeatToggle = (seat: Seat) => {
    const key = seat.label;
    setSelectedSeats(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const handleProceedToPayment = async () => {
    if (!bus || selectedSeats.length === 0) return;
    setReserving(true);
    setConflictError('');
    try {
      const res = await API.reserveSeats(bus.id, selectedSeats);
      setReservation(res);
      setStep(4);
    } catch (err: any) {
      if (err.status === 409) {
        const conflicted: string[] = err.data?.conflictingSeatIds ?? [];
        setConflictError(`Some seats were taken: ${conflicted.join(', ')}. They've been deselected.`);
        setSelectedSeats(prev => prev.filter(s => !conflicted.includes(s)));
      } else {
        toast.error('Failed to reserve seats. Please try again.');
      }
    }
    setReserving(false);
  };

  const handleCancelReservation = async () => {
    if (reservation) {
      try { await API.cancelReservation(reservation.reservationId); } catch { /* ignore */ }
    }
    setReservation(null);
    setSelectedSeats([]);
    setStep(3);
  };

  const handleBookAnother = () => {
    setStep(1); setDestination(null); setBus(null);
    setSelectedSeats([]); setReservation(null); setTicket(null); setConflictError('');
    navigate('/book');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#fff' }}>
      {/* Sticky step progress bar */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 40,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E4E7', padding: '20px 40px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <StepProgress current={step} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        {/* Sticky bottom summary bar (steps 2–4) */}
        {step >= 2 && step <= 4 && destination && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
            background: 'rgba(8,6,13,0.9)', backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '14px 40px',
          }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} color="#facc15" />
                <span style={{ fontSize: 14, color: '#F3F4F6', fontWeight: 600 }}>{destination.name}</span>
              </div>
              {bus && <><span style={{ color: '#4B5563' }}>•</span><span style={{ fontSize: 14, color: '#9CA3AF' }}>{bus.departure}</span></> }
              {selectedSeats.length > 0 && <><span style={{ color: '#4B5563' }}>•</span><span style={{ fontSize: 14, color: '#9CA3AF' }}>Seats: {selectedSeats.join(', ')}</span></> }
              {bus && selectedSeats.length > 0 && <><span style={{ color: '#4B5563' }}>•</span><span style={{ fontSize: 14, fontWeight: 700, color: '#facc15' }}>₱{selectedSeats.length * bus.price}</span></> }
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1 key="s1" onSelect={d => { setDestination(d); setStep(2); }} />
          )}
          {step === 2 && destination && (
            <Step2 key="s2" destination={destination}
              onSelect={b => { setBus(b); setStep(3); }}
              onBack={() => setStep(1)} />
          )}
          {step === 3 && bus && destination && (
            <Step3 key="s3" bus={bus} destination={destination}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              onRefresh={() => setConflictError('')}
              onProceed={handleProceedToPayment}
              onBack={() => setStep(2)}
              conflictError={conflictError} />
          )}
          {step === 4 && bus && destination && reservation && (
            <Step4 key="s4" bus={bus} destination={destination}
              selectedSeats={selectedSeats}
              reservation={reservation}
              onConfirm={(t) => { setTicket(t); setStep(5); }}
              onCancel={handleCancelReservation} />
          )}
          {step === 5 && ticket && (
            <Step5 key="s5" ticket={ticket} onBookAnother={handleBookAnother} />
          )}
        </AnimatePresence>
      </div>

      {step >= 2 && step <= 4 && <div style={{ height: 60 }} />}
    </div>
  );
}
