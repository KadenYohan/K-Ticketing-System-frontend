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

const DESTINATIONS = [
  'One Ayala Makati to Alabang Town Center',
  'One Ayala Makati to Robinsons Las Pinas',
  'One Ayala Makati to Calamba',
  'One Ayala Makati to Imus Cavite',
  'One Ayala Makati to Ayala South Park',
  'One Ayala Makati to Nuvali',
  'One Ayala Makati to Robinsons Antipolo',
  'One Ayala Makati to SM Masinag',
  'One Ayala Makati to UP Town Center',
  'One Ayala Makati to Vista Mall Somo',
  'One Ayala Makati to Vista Mall Taguig'
];

const PRICES = DESTINATIONS.reduce((acc, dest) => {
  acc[dest] = 120.00;
  return acc;
}, {});

// 8 departure times per destination per spec (§7.3)
const DEPARTURE_TIMES = [
  '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00',
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. BUS TABLE
// ─────────────────────────────────────────────────────────────────────────────

const buildBuses = () => {
  const buses = [];

  DESTINATIONS.forEach((dest, dIdx) => {
    DEPARTURE_TIMES.forEach((time) => {
      const id = `b_${dIdx}_${time.replace(':', '')}`;
      
      let status = 'scheduled';
      let avail = 50, res = 0, booked = 0, boarded = 0;

      if (time === '06:00' || time === '08:00') {
        status = 'departed';
        avail = 0; booked = 0; boarded = 50;
      } else if (time === '10:00') {
        avail = 2; booked = 48;
      } else if (time === '12:00') {
        avail = 38; res = 2; booked = 10;
      } else if (time === '14:00' && dIdx === 0) {
        avail = 30; res = 2; booked = 12; boarded = 6;
      }

      buses.push({
        id,
        destination: dest,
        departureDate: TODAY,
        departureTime: time,
        status,
        seatPrice: PRICES[dest],
        seatsAvailable: avail,
        seatsReserved: res,
        seatsBooked: booked,
        seatsBoarded: boarded,
      });
    });
  });

  return buses;
};

export let mockBuses = buildBuses();

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEAT TABLE
// ─────────────────────────────────────────────────────────────────────────────

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

  pushSeats(boarded, 'boarded');
  pushSeats(booked,  'booked');
  pushSeats(res,     'reserved');
  pushSeats(avail,   'available');

  return seats;
};

export let mockSeats = {};
mockBuses.forEach(bus => {
  mockSeats[bus.id] = buildSeatMap(bus.id, {
    avail: bus.seatsAvailable,
    res: bus.seatsReserved,
    booked: bus.seatsBooked,
    boarded: bus.seatsBoarded
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRE-SEEDED TICKETS — for scanner (T22/T23) testing without booking first
// ─────────────────────────────────────────────────────────────────────────────
export const SCANNER_TEST_TICKET_VALID = 'scan-test-valid-001';
export const SCANNER_TEST_TICKET_USED  = 'scan-test-used-001';
export const SCANNER_TEST_TICKET_WRONG = 'scan-test-wrong-001';

const testBusId = 'b_0_1400';
const wrongBusId = 'b_1_1400';

export let mockTickets = {
  [SCANNER_TEST_TICKET_VALID]: {
    ticketId:       SCANNER_TEST_TICKET_VALID,
    busId:          testBusId,
    seats:          [1, 2, 3],
    passengerCount: 3,
    totalAmount:    3 * 120,
    paymentMethod:  'cash',
    qrCode:         SCANNER_TEST_TICKET_VALID,
    destination:    DESTINATIONS[0],
    departureTime:  '14:00',
    departureDate:  TODAY,
    used_at:        null,
  },
  [SCANNER_TEST_TICKET_USED]: {
    ticketId:       SCANNER_TEST_TICKET_USED,
    busId:          testBusId,
    seats:          [4, 5],
    passengerCount: 2,
    totalAmount:    2 * 120,
    paymentMethod:  'gcash',
    qrCode:         SCANNER_TEST_TICKET_USED,
    destination:    DESTINATIONS[0],
    departureTime:  '14:00',
    departureDate:  TODAY,
    used_at:        new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  [SCANNER_TEST_TICKET_WRONG]: {
    ticketId:       SCANNER_TEST_TICKET_WRONG,
    busId:          wrongBusId,
    seats:          [10, 11],
    passengerCount: 2,
    totalAmount:    2 * 120,
    paymentMethod:  'gcash',
    qrCode:         SCANNER_TEST_TICKET_WRONG,
    destination:    DESTINATIONS[1],
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
  mockBuses = buildBuses();
  
  mockSeats = {};
  mockBuses.forEach(bus => {
    mockSeats[bus.id] = buildSeatMap(bus.id, {
      avail: bus.seatsAvailable,
      res: bus.seatsReserved,
      booked: bus.seatsBooked,
      boarded: bus.seatsBoarded
    });
  });

  mockReservations = {};
  mockPayments     = {};
  mockTickets[SCANNER_TEST_TICKET_VALID].used_at = null;
  mockTickets[SCANNER_TEST_TICKET_USED].used_at  = new Date(Date.now() - 15 * 60 * 1000).toISOString();
};
