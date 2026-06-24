// Mock API module for the website — mirrors the transactional logic in k-ticketing-frontend.
// Stateful in-memory store; resets on page refresh (same as the kiosk version).

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ── Shared in-memory store ────────────────────────────────────────────────────
let mockSeats = {};
let mockReservations = {};
let mockPayments = {};
let mockTickets = {};

// Destinations
const DEST_NAMES = ['Calamba', 'Alabang Town Center', 'Ayala South Park', 'Imus Cavite', 'Nuvali', 'Robinsons Antipolo', 'Robinsons Las Piñas'];

// Bus seed — mirrors ppan.md: 8 departures per destination
const DEPARTURE_TIMES = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const SEAT_PRICES = { Calamba: 120, 'Alabang Town Center': 80, 'Ayala South Park': 100, 'Imus Cavite': 120, Nuvali: 150, 'Robinsons Antipolo': 100, 'Robinsons Las Piñas': 120 };
const CAPACITIES = 48; // 4 columns × 12 rows

function makeBusId(dest, time) {
  return `bus-${dest.toLowerCase().replace(/\s+/g, '-')}-${time.replace(':', '')}`;
}

const TODAY = new Date().toISOString().split('T')[0];
const NOW_HOUR = new Date().getHours();

let mockBuses = [];
DEST_NAMES.forEach(dest => {
  DEPARTURE_TIMES.forEach(time => {
    const hour = parseInt(time.split(':')[0]);
    const departed = hour < NOW_HOUR;
    const bookedCount = departed ? CAPACITIES : Math.floor(Math.random() * 15);
    const reservedCount = departed ? 0 : Math.floor(Math.random() * 5);
    const available = CAPACITIES - bookedCount - reservedCount;
    const id = makeBusId(dest, time);
    mockBuses.push({
      id,
      destination: dest,
      departureTime: time,
      status: departed ? 'departed' : 'scheduled',
      seatPrice: SEAT_PRICES[dest],
      seatsAvailable: Math.max(0, available),
      seatsReserved: reservedCount,
      seatsBooked: bookedCount,
      date: TODAY,
    });
  });
});

// Initialise seat maps for all buses
mockBuses.forEach(bus => {
  const seats = [];
  const cols = ['A', 'B', 'C', 'D'];
  let bookedLeft = bus.seatsBooked;
  let reservedLeft = bus.seatsReserved;

  for (let row = 1; row <= 12; row++) {
    for (const col of cols) {
      let status = 'available';
      if (bookedLeft > 0) { status = 'booked'; bookedLeft--; }
      else if (reservedLeft > 0) { status = 'reserved'; reservedLeft--; }

      seats.push({
        seatId: `${bus.id}-${row}${col}`,
        seatNumber: `${row}${col}`,
        status,
        reservationExpiresAt: null,
      });
    }
  }
  mockSeats[bus.id] = seats;
});

// ── API functions ─────────────────────────────────────────────────────────────

export const getDestinations = async () => {
  await delay();
  return DEST_NAMES;
};

export const getBuses = async (date, destination) => {
  await delay();
  return mockBuses.filter(b =>
    (!destination || b.destination === destination) &&
    (!date || b.date === date)
  );
};

export const getSeats = async (busId) => {
  await delay();
  if (!mockSeats[busId]) throw Object.assign(new Error('Bus not found'), { status: 404 });
  return mockSeats[busId];
};

export const reserveSeats = async (busId, seatNumbers) => {
  await delay();
  const seats = mockSeats[busId];
  if (!seats) throw Object.assign(new Error('Bus not found'), { status: 404 });

  // seatNumbers are strings like "1A", "3B"
  const conflicting = seatNumbers.filter(sn => {
    const seat = seats.find(s => s.seatNumber === sn);
    return !seat || seat.status !== 'available';
  });

  if (conflicting.length > 0) {
    const error = new Error('Seats not available');
    error.status = 409;
    error.data = { conflictingSeatIds: conflicting };
    throw error;
  }

  const reservationId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  mockReservations[reservationId] = { busId, seatNumbers, expiresAt };

  seatNumbers.forEach(sn => {
    const seat = seats.find(s => s.seatNumber === sn);
    if (seat) { seat.status = 'reserved'; seat.reservationExpiresAt = expiresAt; }
  });

  return { reservationId, expiresAt };
};

export const cancelReservation = async (id) => {
  await delay();
  const res = mockReservations[id];
  if (res) {
    res.seatNumbers.forEach(sn => {
      const seat = mockSeats[res.busId]?.find(s => s.seatNumber === sn);
      if (seat && seat.status === 'reserved') {
        seat.status = 'available';
        seat.reservationExpiresAt = null;
      }
    });
    delete mockReservations[id];
  }
  return { success: true };
};

export const initiatePayment = async (reservationId, amount) => {
  await delay();
  const paymentId = crypto.randomUUID();
  mockPayments[paymentId] = { reservationId, amount, status: 'pending', polls: 0 };
  return {
    paymentId,
    qrImageUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23007DFF'/><text x='50%' y='50%' fill='white' font-size='14' text-anchor='middle' dominant-baseline='middle' font-family='monospace'>GCASH QR\\n${paymentId.slice(0,8)}</text></svg>`,
    redirectUrl: `https://sandbox.paymongo.com/checkout/${paymentId}`,
  };
};

export const pollPaymentStatus = async (id) => {
  await delay(200);
  const payment = mockPayments[id];
  if (!payment) return { status: 'failed' };
  // Auto-resolve to 'paid' after 3 polls (~6 seconds at 2s interval)
  if (payment.status === 'pending') {
    payment.polls++;
    if (payment.polls >= 3) payment.status = 'paid';
  }
  return { status: payment.status };
};

export const createTicket = async (reservationId, paymentMethod, paymentRef) => {
  await delay();
  const res = mockReservations[reservationId];
  if (!res) throw Object.assign(new Error('Reservation expired'), { status: 410 });

  const bus = mockBuses.find(b => b.id === res.busId);
  if (!bus) throw Object.assign(new Error('Bus not found'), { status: 404 });

  const ticketId = crypto.randomUUID();

  mockTickets[ticketId] = {
    ticketId,
    busId: res.busId,
    seats: res.seatNumbers,
    passengerCount: res.seatNumbers.length,
    totalAmount: res.seatNumbers.length * bus.seatPrice,
    paymentMethod,
    qrCode: ticketId,
    destination: bus.destination,
    departureTime: bus.departureTime,
    departureDate: TODAY,
  };

  // Mark seats as booked
  res.seatNumbers.forEach(sn => {
    const seat = mockSeats[res.busId]?.find(s => s.seatNumber === sn);
    if (seat) { seat.status = 'booked'; seat.reservationExpiresAt = null; }
  });

  delete mockReservations[reservationId];
  return mockTickets[ticketId];
};

export const validateTicket = async (qrData, busId) => {
  await delay();
  const ticket = mockTickets[qrData];
  if (!ticket) return { valid: false, reason: 'Ticket not found.', seats: [], remainingUnboarded: 0 };
  if (ticket.busId !== busId) return { valid: false, reason: 'Ticket is for a different bus.', seats: [], remainingUnboarded: 0 };
  if (ticket.used_at) return { valid: false, reason: 'Ticket already used for boarding.', seats: ticket.seats, remainingUnboarded: 0 };

  const remaining = (mockSeats[busId] || []).filter(s => s.status === 'booked').length - ticket.seats.length;
  return { valid: true, reason: '', seats: ticket.seats, remainingUnboarded: Math.max(0, remaining) };
};

export const checkInTicket = async (ticketId, busId) => {
  await delay();
  const ticket = mockTickets[ticketId];
  if (ticket) {
    ticket.used_at = new Date().toISOString();
    ticket.seats.forEach(sn => {
      const seat = mockSeats[busId]?.find(s => s.seatNumber === sn);
      if (seat) seat.status = 'boarded';
    });
  }
  return { success: true, seats: ticket?.seats ?? [], alreadyBoarded: false };
};
