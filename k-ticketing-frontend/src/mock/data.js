/**
 * T5 — Mock Data Layer  (src/mock/data.js)
 *
 * Provides a fully-populated in-memory "database" for local frontend
 * development with NO backend dependency.
 *
 * Covers all states documented in ppan.md §8:
 *  - Bus statuses:   scheduled, departed
 *  - Seat statuses:  available, reserved, booked, boarded
 *  - Payment states: pending, paid, failed
 *  - Error codes:    409 conflict, 410 expired reservation
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONFIG — shared dates / price table
// ─────────────────────────────────────────────────────────────────────────────
export const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const DESTINATIONS = ['Manila', 'Baguio', 'Pampanga'];

const PRICES = {
  Manila:   500.00,
  Baguio:   750.00,
  Pampanga: 350.00,
};

// 8 departure times per destination per spec (§7.3)
const DEPARTURE_TIMES = [
  '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00',
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. BUS TABLE — 24 buses (8 times × 3 destinations), mixed statuses
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the 24-bus roster for today with realistic availability.
 *
 * Naming:  b_{dest_initial}_{HHMM}
 * E.g.:    b_m_0600 = Manila 06:00
 *
 * Pre-seeded states for testing different UI branches:
 *  - b_m_0600  → departed (past bus)
 *  - b_m_0800  → fully booked (0 seats available)
 *  - b_m_1000  → partially booked (real mix)
 *  - b_b_0600  → departed
 *  - b_b_1200  → has reserved seats (timer running)
 *  - b_p_1400  → scanner test bus (several booked+boarded tickets)
 *  - All others → various available counts for UI realism
 */
const buildBuses = () => {
  const buses = [];

  const configs = {
    Manila: [
      { time: '06:00', id: 'b_m_0600', status: 'departed',  avail:  0, res:  0, booked:  0, boarded: 50 },
      { time: '08:00', id: 'b_m_0800', status: 'departed',  avail:  0, res:  0, booked:  0, boarded: 50 },
      { time: '10:00', id: 'b_m_1000', status: 'scheduled', avail:  2, res:  0, booked: 48, boarded:  0 },
      { time: '12:00', id: 'b_m_1200', status: 'scheduled', avail: 38, res:  2, booked: 10, boarded:  0 },
      { time: '14:00', id: 'b_m_1400', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '16:00', id: 'b_m_1600', status: 'scheduled', avail: 43, res:  0, booked:  7, boarded:  0 },
      { time: '18:00', id: 'b_m_1800', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '20:00', id: 'b_m_2000', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
    ],
    Baguio: [
      { time: '06:00', id: 'b_b_0600', status: 'departed',  avail:  0, res:  0, booked:  0, boarded: 50 },
      { time: '08:00', id: 'b_b_0800', status: 'departed',  avail:  0, res:  0, booked:  2, boarded: 48 },
      { time: '10:00', id: 'b_b_1000', status: 'scheduled', avail: 45, res:  0, booked:  5, boarded:  0 },
      { time: '12:00', id: 'b_b_1200', status: 'scheduled', avail: 44, res:  4, booked:  2, boarded:  0 },
      { time: '14:00', id: 'b_b_1400', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '16:00', id: 'b_b_1600', status: 'scheduled', avail: 48, res:  0, booked:  2, boarded:  0 },
      { time: '18:00', id: 'b_b_1800', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '20:00', id: 'b_b_2000', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
    ],
    Pampanga: [
      { time: '06:00', id: 'b_p_0600', status: 'departed',  avail:  0, res:  0, booked:  0, boarded: 50 },
      { time: '08:00', id: 'b_p_0800', status: 'departed',  avail:  0, res:  0, booked:  0, boarded: 50 },
      { time: '10:00', id: 'b_p_1000', status: 'scheduled', avail: 46, res:  0, booked:  4, boarded:  0 },
      { time: '12:00', id: 'b_p_1200', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '14:00', id: 'b_p_1400', status: 'scheduled', avail: 30, res:  2, booked: 12, boarded:  6 },
      { time: '16:00', id: 'b_p_1600', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '18:00', id: 'b_p_1800', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
      { time: '20:00', id: 'b_p_2000', status: 'scheduled', avail: 50, res:  0, booked:  0, boarded:  0 },
    ],
  };

  for (const [dest, rows] of Object.entries(configs)) {
    for (const r of rows) {
      buses.push({
        id:              r.id,
        destination:     dest,
        departureDate:   TODAY,
        departureTime:   r.time,
        status:          r.status,
        seatPrice:       PRICES[dest],
        seatsAvailable:  r.avail,
        seatsReserved:   r.res,
        seatsBooked:     r.booked,
        seatsBoarded:    r.boarded,
      });
    }
  }

  return buses;
};

export let mockBuses = buildBuses();

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEAT TABLE — 50 seats per bus, status-mixed to match bus config above
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates 50 seats for a bus, assigning statuses to match the bus-level
 * availability counts declared above. Reserved seats get a 4-minute expiry
 * timer (enough to see the countdown in action without waiting too long).
 */
const buildSeatMap = (busId, { avail, res, booked, boarded }) => {
  const seats = [];
  let seatNum = 1;
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

  const pushSeats = (count, status) => {
    for (let i = 0; i < count && seatNum <= 50; i++, seatNum++) {
      seats.push({
        seatId:              seatNum,
        seatNumber:          seatNum,
        status,
        reservationExpiresAt: status === 'reserved' ? expiresAt : null,
      });
    }
  };

  // Fill in the specific order: boarded → booked → reserved → available
  pushSeats(boarded, 'boarded');
  pushSeats(booked,  'booked');
  pushSeats(res,     'reserved');
  pushSeats(avail,   'available');

  return seats;
};

const seatConfigs = {
  b_m_0600: { avail: 0,  res: 0, booked: 0,  boarded: 50 },
  b_m_0800: { avail: 0,  res: 0, booked: 0,  boarded: 50 },
  b_m_1000: { avail: 2,  res: 0, booked: 48, boarded: 0  },
  b_m_1200: { avail: 38, res: 2, booked: 10, boarded: 0  },
  b_m_1400: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_m_1600: { avail: 43, res: 0, booked: 7,  boarded: 0  },
  b_m_1800: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_m_2000: { avail: 50, res: 0, booked: 0,  boarded: 0  },

  b_b_0600: { avail: 0,  res: 0, booked: 0,  boarded: 50 },
  b_b_0800: { avail: 0,  res: 0, booked: 2,  boarded: 48 },
  b_b_1000: { avail: 45, res: 0, booked: 5,  boarded: 0  },
  b_b_1200: { avail: 44, res: 4, booked: 2,  boarded: 0  },
  b_b_1400: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_b_1600: { avail: 48, res: 0, booked: 2,  boarded: 0  },
  b_b_1800: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_b_2000: { avail: 50, res: 0, booked: 0,  boarded: 0  },

  b_p_0600: { avail: 0,  res: 0, booked: 0,  boarded: 50 },
  b_p_0800: { avail: 0,  res: 0, booked: 0,  boarded: 50 },
  b_p_1000: { avail: 46, res: 0, booked: 4,  boarded: 0  },
  b_p_1200: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_p_1400: { avail: 30, res: 2, booked: 12, boarded: 6  },
  b_p_1600: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_p_1800: { avail: 50, res: 0, booked: 0,  boarded: 0  },
  b_p_2000: { avail: 50, res: 0, booked: 0,  boarded: 0  },
};

export let mockSeats = Object.fromEntries(
  Object.entries(seatConfigs).map(([busId, cfg]) => [busId, buildSeatMap(busId, cfg)])
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRE-SEEDED TICKETS — for scanner (T22/T23) testing without booking first
// ─────────────────────────────────────────────────────────────────────────────
//
// QR codes are just the ticketId string — scan these in the scanner to test:
//   TICKET_VALID_PAMPANGA   → scans as valid (use b_p_1400)
//   TICKET_USED             → already checked in (invalid)
//   TICKET_WRONG_BUS        → for wrong bus (invalid)
//
export const SCANNER_TEST_TICKET_VALID = 'scan-test-valid-001';
export const SCANNER_TEST_TICKET_USED  = 'scan-test-used-001';
export const SCANNER_TEST_TICKET_WRONG = 'scan-test-wrong-001';

export let mockTickets = {
  [SCANNER_TEST_TICKET_VALID]: {
    ticketId:       SCANNER_TEST_TICKET_VALID,
    busId:          'b_p_1400',
    seats:          [1, 2, 3],
    passengerCount: 3,
    totalAmount:    3 * PRICES['Pampanga'],
    paymentMethod:  'cash',
    qrCode:         SCANNER_TEST_TICKET_VALID,
    destination:    'Pampanga',
    departureTime:  '14:00',
    departureDate:  TODAY,
    used_at:        null,
  },
  [SCANNER_TEST_TICKET_USED]: {
    ticketId:       SCANNER_TEST_TICKET_USED,
    busId:          'b_p_1400',
    seats:          [4, 5],
    passengerCount: 2,
    totalAmount:    2 * PRICES['Pampanga'],
    paymentMethod:  'gcash',
    qrCode:         SCANNER_TEST_TICKET_USED,
    destination:    'Pampanga',
    departureTime:  '14:00',
    departureDate:  TODAY,
    used_at:        new Date(Date.now() - 15 * 60 * 1000).toISOString(), // checked in 15 min ago
  },
  [SCANNER_TEST_TICKET_WRONG]: {
    ticketId:       SCANNER_TEST_TICKET_WRONG,
    busId:          'b_m_1400',   // Manila bus, not Pampanga
    seats:          [10, 11],
    passengerCount: 2,
    totalAmount:    2 * PRICES['Manila'],
    paymentMethod:  'gcash',
    qrCode:         SCANNER_TEST_TICKET_WRONG,
    destination:    'Manila',
    departureTime:  '14:00',
    departureDate:  TODAY,
    used_at:        null,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. LIVE TRANSACTION TABLES — populated by api.js functions at runtime
// ─────────────────────────────────────────────────────────────────────────────
export let mockReservations = {};
export let mockPayments     = {};

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESET HELPER — restore clean initial state (useful for e2e test scripts)
// ─────────────────────────────────────────────────────────────────────────────
export const resetMockDatabase = () => {
  mockBuses        = buildBuses();
  mockSeats        = Object.fromEntries(
    Object.entries(seatConfigs).map(([id, cfg]) => [id, buildSeatMap(id, cfg)])
  );
  mockReservations = {};
  mockPayments     = {};
  // Keep pre-seeded tickets but reset the scanner-valid ticket's used_at
  mockTickets[SCANNER_TEST_TICKET_VALID].used_at = null;
  mockTickets[SCANNER_TEST_TICKET_USED].used_at  = new Date(Date.now() - 15 * 60 * 1000).toISOString();
};
