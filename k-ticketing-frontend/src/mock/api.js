/**
 * T5 — Mock API Layer  (src/mock/api.js)
 *
 * Mirrors the exact signatures of api/real.js so the API switcher
 * in api/index.js can swap between mock and real transparently.
 *
 * All functions return Promises — identical contract to fetch-based real API.
 *
 * State coverage per ppan.md §8:
 *  ✓ Success paths for every endpoint
 *  ✓ 409 Conflict (seat already taken by concurrent client)
 *  ✓ 410 Expired Reservation (GCash payment arrived after 5-min window)
 *  ✓ Payment states: pending → paid (auto after 3 polls) / failed (forced)
 *  ✓ Scanner: valid ticket, already-used, wrong-bus
 *  ✓ Scanner: getBuses without destination filter (all buses for today)
 */

import {
  mockBuses,
  mockSeats,
  mockReservations,
  mockPayments,
  mockTickets,
  TODAY,
} from './data';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Simulates network round-trip latency */
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Throw a structured API error identical to the shape real.js produces,
 * so page components handle both the same way.
 */
const apiError = (status, message, data = {}) => {
  const err = new Error(message);
  err.status = status;
  err.data   = data;
  return err;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /destinations
// Returns: string[]
// ─────────────────────────────────────────────────────────────────────────────
export const getDestinations = async () => {
  await delay();
  // Deduplicated from live bus table — mirrors the real query
  const dests = [...new Set(mockBuses.map(b => b.destination))].sort();
  return dests;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /buses?date={date}&destination={dest}
//
// For the Scanner flow (§6.3), destination is omitted → returns all buses.
// Sorted by departure_time ASC.
// Returns: Bus[]
// ─────────────────────────────────────────────────────────────────────────────
export const getBuses = async (date, destination) => {
  await delay();

  let result = mockBuses.filter(b => b.departureDate === (date || TODAY));

  if (destination) {
    result = result.filter(b => b.destination === destination);
  }

  // Sort by departure time string (HH:MM lexicographic sort works correctly)
  result = [...result].sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /buses/:id/seats
// Returns: Seat[]
// ─────────────────────────────────────────────────────────────────────────────
export const getSeats = async (busId) => {
  await delay();
  if (!mockSeats[busId]) throw apiError(404, `Bus ${busId} not found`);
  return mockSeats[busId];
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /reservations
// Body: { busId, seatIds: number[] }
// Returns: { reservationId, expiresAt }
// Throws: 409 { conflictingSeatIds } if any seat is not 'available'
// ─────────────────────────────────────────────────────────────────────────────
export const reserveSeats = async (busId, seatIds) => {
  await delay();

  const seats = mockSeats[busId];
  if (!seats) throw apiError(404, `Bus ${busId} not found`);

  // Identify conflicts (reserved/booked/boarded seats)
  const conflicting = seatIds.filter(num => {
    const seat = seats.find(s => s.seatNumber === num);
    return !seat || seat.status !== 'available';
  });

  if (conflicting.length > 0) {
    throw apiError(409, 'Seat conflict: some seats were claimed by another client', {
      conflictingSeatIds: conflicting,
    });
  }

  const reservationId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

  // Persist reservation
  mockReservations[reservationId] = {
    busId,
    seatIds,
    expiresAt,
    createdAt: new Date().toISOString(),
  };

  // Mark seats as reserved
  seatIds.forEach(num => {
    const seat = seats.find(s => s.seatNumber === num);
    if (seat) {
      seat.status                = 'reserved';
      seat.reservationExpiresAt  = expiresAt;
      seat.reservationId         = reservationId;
    }
  });

  // Update bus-level counters
  const bus = mockBuses.find(b => b.id === busId);
  if (bus) {
    bus.seatsAvailable -= seatIds.length;
    bus.seatsReserved  += seatIds.length;
  }

  return { reservationId, expiresAt };
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /reservations/:id
// Returns: { success: true }
// ─────────────────────────────────────────────────────────────────────────────
export const cancelReservation = async (reservationId) => {
  await delay();

  const res = mockReservations[reservationId];
  if (!res) {
    // 404 is acceptable — reservation may have already expired
    return { success: true };
  }

  // Release seats
  const seats = mockSeats[res.busId] || [];
  res.seatIds.forEach(num => {
    const seat = seats.find(s => s.seatNumber === num);
    if (seat && seat.status === 'reserved') {
      seat.status               = 'available';
      seat.reservationExpiresAt = null;
      seat.reservationId        = null;
    }
  });

  // Update bus counters
  const bus = mockBuses.find(b => b.id === res.busId);
  if (bus) {
    bus.seatsAvailable += res.seatIds.length;
    bus.seatsReserved  -= res.seatIds.length;
  }

  delete mockReservations[reservationId];
  return { success: true };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /payments
// Body: { reservationId, amount }
// Returns: { paymentId, qrImageUrl, redirectUrl }
// ─────────────────────────────────────────────────────────────────────────────
export const initiatePayment = async (reservationId, amount) => {
  await delay(500); // slightly longer — simulates PayMongo round-trip

  const res = mockReservations[reservationId];
  if (!res) throw apiError(410, 'Reservation expired before payment could be initiated');

  const paymentId = crypto.randomUUID();

  // Generate a realistic-looking fake QR as an inline SVG data URL
  // (a real QR code would be an image URL from PayMongo's CDN)
  const qrSvg = generateMockQrSvg(paymentId);

  mockPayments[paymentId] = {
    paymentId,
    reservationId,
    amount,
    status: 'pending',
    polls:  0,
    createdAt: new Date().toISOString(),
  };

  return {
    paymentId,
    qrImageUrl:  qrSvg,
    redirectUrl: `https://sandbox.paymongo.com/checkout/${paymentId}`,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /payments/:id/status
// Returns: { status: 'pending' | 'paid' | 'failed' }
//
// Simulation logic (covers all three payment states):
//  - Polls 1-2 → 'pending'
//  - Poll 3+   → 'paid'   (normal happy path)
//  - If paymentId ends with 'f' → simulate 'failed' on poll 3
// ─────────────────────────────────────────────────────────────────────────────
export const pollPaymentStatus = async (paymentId) => {
  await delay(200); // fast poll response

  const payment = mockPayments[paymentId];
  if (!payment) return { status: 'failed' };

  // Only advance state while still pending
  if (payment.status === 'pending') {
    payment.polls++;
    if (payment.polls >= 3) {
      // Simulate a failure scenario if paymentId ends with 'f'
      payment.status = paymentId.endsWith('f') ? 'failed' : 'paid';
    }
  }

  return { status: payment.status };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /tickets
// Body: { reservationId, paymentMethod: 'gcash'|'cash', paymentRef? }
// Returns: Ticket
// Throws: 410 if reservation no longer exists (expired)
// ─────────────────────────────────────────────────────────────────────────────
export const createTicket = async (reservationId, paymentMethod, paymentRef) => {
  await delay();

  const res = mockReservations[reservationId];
  if (!res) {
    throw apiError(410, 'Reservation expired before ticket could be confirmed');
  }

  // Check reservation has not expired client-side (server enforces this too)
  if (new Date(res.expiresAt) < new Date()) {
    // Clean up stale reservation
    delete mockReservations[reservationId];
    throw apiError(410, 'Reservation expired before ticket could be confirmed');
  }

  const ticketId = crypto.randomUUID();
  const bus      = mockBuses.find(b => b.id === res.busId);

  if (!bus) throw apiError(404, `Bus ${res.busId} not found`);

  const ticket = {
    ticketId,
    busId:         res.busId,
    seats:         res.seatIds,
    passengerCount: res.seatIds.length,
    totalAmount:   res.seatIds.length * bus.seatPrice,
    paymentMethod,
    paymentRef:    paymentRef || null,
    qrCode:        ticketId,   // The string to encode in the QR image
    destination:   bus.destination,
    departureTime: bus.departureTime,
    departureDate: TODAY,
    used_at:       null,
  };

  mockTickets[ticketId] = ticket;

  // Promote reserved → booked
  const seats = mockSeats[res.busId] || [];
  res.seatIds.forEach(num => {
    const seat = seats.find(s => s.seatNumber === num);
    if (seat) {
      seat.status               = 'booked';
      seat.reservationExpiresAt = null;
      seat.reservationId        = null;
    }
  });

  // Update bus counters
  if (bus) {
    bus.seatsReserved  -= res.seatIds.length;
    bus.seatsBooked    += res.seatIds.length;
  }

  delete mockReservations[reservationId];

  return ticket;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /validate
// Body: { qrData, busId }
// Returns: ValidationResult { valid, reason, seats, remainingUnboarded }
// ─────────────────────────────────────────────────────────────────────────────
export const validateTicket = async (qrData, busId) => {
  await delay(300);

  const ticket = mockTickets[qrData];

  if (!ticket) {
    return {
      valid: false,
      reason: 'Ticket not found in system. The QR code may be invalid or forged.',
      seats: [],
      remainingUnboarded: 0,
    };
  }

  if (ticket.busId !== busId) {
    const bus = mockBuses.find(b => b.id === ticket.busId);
    const expectedRoute = bus ? `${bus.destination} ${bus.departureTime}` : ticket.busId;
    return {
      valid: false,
      reason: `Ticket is for a different bus (${expectedRoute}). Wrong bus selected.`,
      seats: ticket.seats,
      remainingUnboarded: 0,
    };
  }

  if (ticket.used_at) {
    const usedTime = new Date(ticket.used_at).toLocaleTimeString('en-PH', {
      hour: '2-digit', minute: '2-digit',
    });
    return {
      valid: false,
      reason: `Ticket already used. Checked in at ${usedTime}.`,
      seats: ticket.seats,
      remainingUnboarded: 0,
    };
  }

  // Compute remainingUnboarded: booked seats on this bus EXCLUDING the ones on this ticket
  const busSeats = mockSeats[busId] || [];
  const bookedElsewhere = busSeats.filter(
    s => s.status === 'booked' && !ticket.seats.includes(s.seatNumber)
  ).length;

  return {
    valid: true,
    reason: '',
    seats: ticket.seats,
    remainingUnboarded: bookedElsewhere,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /checkin
// Body: { ticketId, busId }
// Returns: { success, seats, alreadyBoarded }
// (Idempotent — calling twice is safe per spec §6.3)
// ─────────────────────────────────────────────────────────────────────────────
export const checkInTicket = async (ticketId, busId) => {
  await delay();

  const ticket = mockTickets[ticketId];

  if (!ticket) {
    throw apiError(404, `Ticket ${ticketId} not found`);
  }

  const alreadyBoarded = !!ticket.used_at;

  if (!alreadyBoarded) {
    ticket.used_at = new Date().toISOString();

    // Mark seats as boarded
    const seats = mockSeats[busId] || [];
    ticket.seats.forEach(num => {
      const seat = seats.find(s => s.seatNumber === num);
      if (seat) {
        seat.status = 'boarded';
      }
    });

    // Update bus counters
    const bus = mockBuses.find(b => b.id === busId);
    if (bus) {
      bus.seatsBooked  -= ticket.seats.length;
      bus.seatsBoarded += ticket.seats.length;
    }
  }

  return {
    success: true,
    seats: ticket.seats,
    alreadyBoarded,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal — Generates a mock QR-style SVG data URL
// The pattern looks like a QR code grid for visual authenticity in the UI.
// ─────────────────────────────────────────────────────────────────────────────
function generateMockQrSvg(paymentId) {
  const size  = 150;
  const cells = 10; // 10×10 grid of square modules
  const cell  = size / cells;

  // Deterministically seed the pattern from the paymentId characters
  const chars = paymentId.replace(/-/g, '');
  let rects   = '';

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const charCode = chars.charCodeAt((r * cells + c) % chars.length) || 65;
      const on       = charCode % 2 === 0;
      // Keep the 3 corner finder patterns always filled (standard QR look)
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c >= cells - 3) ||
        (r >= cells - 3 && c < 3);
      if (on || isCorner) {
        rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell - 1}" height="${cell - 1}" fill="#0f172a"/>`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="white" rx="6"/>
  ${rects}
  <text x="${size / 2}" y="${size - 4}" text-anchor="middle" font-size="8" fill="#64748b" font-family="monospace">PAYMONGO · MOCK</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
