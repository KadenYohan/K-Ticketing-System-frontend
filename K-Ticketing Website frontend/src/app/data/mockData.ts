export type SeatStatus = 'available' | 'selected' | 'reserved' | 'booked' | 'boarded';
export type BusStatus = 'scheduled' | 'departed' | 'cancelled';
export type PaymentMethod = 'gcash' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Destination {
  id: string;
  name: string;
  fullRoute: string;
  duration: string;
  priceFrom: number;
  image?: string;
}

export interface Bus {
  id: string;
  destinationId: string;
  destination: string;
  route: string;
  departure: string;
  price: number;
  capacity: number;
  available: number;
  reserved: number;
  booked: number;
  boarded: number;
  status: BusStatus;
  date: string;
}

export interface Seat {
  id: string;
  row: number;
  col: 'A' | 'B' | 'C' | 'D';
  label: string;
  status: SeatStatus;
}

export interface Ticket {
  id: string;
  busId: string;
  destination: string;
  route: string;
  date: string;
  departure: string;
  seats: string[];
  passengers: number;
  paymentMethod: PaymentMethod;
  amount: number;
  boarded: boolean;
  boardedAt?: string;
  createdAt: string;
  qrCode: string;
}

export interface Payment {
  id: string;
  ticketId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference?: string;
  timestamp: string;
}

export const DESTINATIONS: Destination[] = [
  { id: 'calamba', name: 'Calamba', fullRoute: 'One Ayala Makati → Calamba', duration: '1.5 hrs', priceFrom: 120 },
  { id: 'alabang', name: 'Alabang Town Center', fullRoute: 'One Ayala Makati → Alabang Town Center', duration: '45 min', priceFrom: 80 },
  { id: 'southpark', name: 'Ayala South Park', fullRoute: 'One Ayala Makati → Ayala South Park', duration: '1 hr', priceFrom: 100 },
  { id: 'cavite', name: 'Imus Cavite', fullRoute: 'One Ayala Makati → Imus Cavite', duration: '1.5 hrs', priceFrom: 120 },
  { id: 'nuvali', name: 'Nuvali', fullRoute: 'One Ayala Makati → Nuvali', duration: '2 hrs', priceFrom: 150 },
  { id: 'antipolo', name: 'Robinsons Antipolo', fullRoute: 'One Ayala Makati → Robinsons Antipolo', duration: '1 hr', priceFrom: 100 },
  { id: 'laspinas', name: 'Robinsons Las Pinas', fullRoute: 'One Ayala Makati → Robinsons Las Pinas', duration: '1.5 hrs', priceFrom: 120 },
];

const makeSeats = (busId: string, bookedRows: number[] = [], reservedSeats: string[] = []): Seat[] => {
  const seats: Seat[] = [];
  const cols: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  for (let row = 1; row <= 12; row++) {
    for (const col of cols) {
      const label = `${row}${col}`;
      let status: SeatStatus = 'available';
      if (bookedRows.includes(row)) status = 'booked';
      if (reservedSeats.includes(label)) status = 'reserved';
      seats.push({ id: `${busId}-${label}`, row, col, label, status });
    }
  }
  return seats;
};

export const BUSES: Bus[] = [
  // Calamba buses
  { id: 'bus-cal-1', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '06:00', price: 120, capacity: 48, available: 0, reserved: 0, booked: 48, boarded: 48, status: 'departed', date: '2026-06-23' },
  { id: 'bus-cal-2', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '08:00', price: 120, capacity: 48, available: 0, reserved: 0, booked: 48, boarded: 40, status: 'departed', date: '2026-06-23' },
  { id: 'bus-cal-3', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '10:00', price: 120, capacity: 48, available: 2, reserved: 3, booked: 43, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cal-4', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '12:00', price: 120, capacity: 48, available: 36, reserved: 2, booked: 10, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cal-5', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '14:00', price: 120, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cal-6', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '16:00', price: 120, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cal-7', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '18:00', price: 120, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cal-8', destinationId: 'calamba', destination: 'Calamba', route: 'One Ayala Makati → Calamba', departure: '20:00', price: 120, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  // Alabang buses
  { id: 'bus-ala-1', destinationId: 'alabang', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', departure: '06:30', price: 80, capacity: 48, available: 0, reserved: 0, booked: 48, boarded: 48, status: 'departed', date: '2026-06-23' },
  { id: 'bus-ala-2', destinationId: 'alabang', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', departure: '08:30', price: 80, capacity: 48, available: 12, reserved: 4, booked: 32, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-ala-3', destinationId: 'alabang', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', departure: '10:30', price: 80, capacity: 48, available: 40, reserved: 2, booked: 6, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-ala-4', destinationId: 'alabang', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', departure: '13:00', price: 80, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  // Nuvali buses
  { id: 'bus-nuv-1', destinationId: 'nuvali', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', departure: '07:00', price: 150, capacity: 48, available: 0, reserved: 0, booked: 48, boarded: 48, status: 'departed', date: '2026-06-23' },
  { id: 'bus-nuv-2', destinationId: 'nuvali', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', departure: '09:30', price: 150, capacity: 48, available: 22, reserved: 5, booked: 21, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-nuv-3', destinationId: 'nuvali', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', departure: '12:30', price: 150, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-nuv-4', destinationId: 'nuvali', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', departure: '15:00', price: 150, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  // Antipolo
  { id: 'bus-ant-1', destinationId: 'antipolo', destination: 'Robinsons Antipolo', route: 'One Ayala Makati → Robinsons Antipolo', departure: '07:30', price: 100, capacity: 48, available: 8, reserved: 3, booked: 37, boarded: 20, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-ant-2', destinationId: 'antipolo', destination: 'Robinsons Antipolo', route: 'One Ayala Makati → Robinsons Antipolo', departure: '11:00', price: 100, capacity: 48, available: 35, reserved: 0, booked: 13, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  // Cavite
  { id: 'bus-cav-1', destinationId: 'cavite', destination: 'Imus Cavite', route: 'One Ayala Makati → Imus Cavite', departure: '08:00', price: 120, capacity: 48, available: 5, reserved: 8, booked: 35, boarded: 0, status: 'scheduled', date: '2026-06-23' },
  { id: 'bus-cav-2', destinationId: 'cavite', destination: 'Imus Cavite', route: 'One Ayala Makati → Imus Cavite', departure: '14:00', price: 120, capacity: 48, available: 48, reserved: 0, booked: 0, boarded: 0, status: 'scheduled', date: '2026-06-23' },
];

export const getBusesByDestination = (destinationId: string): Bus[] =>
  BUSES.filter(b => b.destinationId === destinationId);

export const getBusById = (id: string): Bus | undefined =>
  BUSES.find(b => b.id === id);

export const getSeatsForBus = (busId: string): Seat[] => {
  const bus = getBusById(busId);
  if (!bus) return makeSeats(busId);
  const bookedCount = bus.booked + bus.boarded;
  const bookedRows: number[] = [];
  const reservedSeats: string[] = [];
  // Fill booked rows from the front
  let filled = 0;
  for (let row = 1; row <= 12 && filled < bookedCount; row++) {
    bookedRows.push(row);
    filled += 4;
  }
  // Add some reserved seats
  if (bus.reserved > 0) {
    const nextRow = bookedRows.length + 1;
    if (nextRow <= 12) {
      reservedSeats.push(`${nextRow}A`, `${nextRow}B`);
    }
  }
  return makeSeats(busId, bookedRows, reservedSeats);
};

export const TICKETS: Ticket[] = [
  { id: 'tkt-001', busId: 'bus-cal-1', destination: 'Calamba', route: 'One Ayala Makati → Calamba', date: '2026-06-23', departure: '06:00', seats: ['3A', '3B'], passengers: 2, paymentMethod: 'gcash', amount: 240, boarded: true, boardedAt: '05:55', createdAt: '2026-06-23 05:30', qrCode: 'tkt-001-qr' },
  { id: 'tkt-002', busId: 'bus-cal-2', destination: 'Calamba', route: 'One Ayala Makati → Calamba', date: '2026-06-23', departure: '08:00', seats: ['1A'], passengers: 1, paymentMethod: 'cash', amount: 120, boarded: true, boardedAt: '07:50', createdAt: '2026-06-23 07:20', qrCode: 'tkt-002-qr' },
  { id: 'tkt-003', busId: 'bus-ala-2', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', date: '2026-06-23', departure: '08:30', seats: ['5A', '5B', '5C'], passengers: 3, paymentMethod: 'gcash', amount: 240, boarded: false, createdAt: '2026-06-23 08:00', qrCode: 'tkt-003-qr' },
  { id: 'tkt-004', busId: 'bus-nuv-2', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', date: '2026-06-23', departure: '09:30', seats: ['2C', '2D'], passengers: 2, paymentMethod: 'gcash', amount: 300, boarded: false, createdAt: '2026-06-23 09:00', qrCode: 'tkt-004-qr' },
  { id: 'tkt-005', busId: 'bus-cal-3', destination: 'Calamba', route: 'One Ayala Makati → Calamba', date: '2026-06-23', departure: '10:00', seats: ['7A'], passengers: 1, paymentMethod: 'cash', amount: 120, boarded: false, createdAt: '2026-06-23 09:45', qrCode: 'tkt-005-qr' },
  { id: 'tkt-006', busId: 'bus-ant-1', destination: 'Robinsons Antipolo', route: 'One Ayala Makati → Robinsons Antipolo', date: '2026-06-23', departure: '07:30', seats: ['4A', '4B', '4C', '4D'], passengers: 4, paymentMethod: 'gcash', amount: 400, boarded: true, boardedAt: '07:25', createdAt: '2026-06-23 07:00', qrCode: 'tkt-006-qr' },
  { id: 'tkt-007', busId: 'bus-cav-1', destination: 'Imus Cavite', route: 'One Ayala Makati → Imus Cavite', date: '2026-06-23', departure: '08:00', seats: ['6C', '6D'], passengers: 2, paymentMethod: 'gcash', amount: 240, boarded: false, createdAt: '2026-06-23 07:30', qrCode: 'tkt-007-qr' },
  { id: 'tkt-008', busId: 'bus-ala-2', destination: 'Alabang Town Center', route: 'One Ayala Makati → Alabang Town Center', date: '2026-06-23', departure: '08:30', seats: ['8A'], passengers: 1, paymentMethod: 'cash', amount: 80, boarded: false, createdAt: '2026-06-23 08:10', qrCode: 'tkt-008-qr' },
  { id: 'tkt-009', busId: 'bus-cal-4', destination: 'Calamba', route: 'One Ayala Makati → Calamba', date: '2026-06-23', departure: '12:00', seats: ['9A', '9B'], passengers: 2, paymentMethod: 'gcash', amount: 240, boarded: false, createdAt: '2026-06-23 11:00', qrCode: 'tkt-009-qr' },
  { id: 'tkt-010', busId: 'bus-nuv-1', destination: 'Nuvali', route: 'One Ayala Makati → Nuvali', date: '2026-06-23', departure: '07:00', seats: ['1A', '1B', '1C'], passengers: 3, paymentMethod: 'gcash', amount: 450, boarded: true, boardedAt: '06:55', createdAt: '2026-06-23 06:30', qrCode: 'tkt-010-qr' },
];

export const PAYMENTS: Payment[] = [
  { id: 'pay-001', ticketId: 'tkt-001', method: 'gcash', amount: 240, status: 'paid', reference: 'GC-2026062301', timestamp: '2026-06-23 05:32' },
  { id: 'pay-002', ticketId: 'tkt-002', method: 'cash', amount: 120, status: 'paid', timestamp: '2026-06-23 07:21' },
  { id: 'pay-003', ticketId: 'tkt-003', method: 'gcash', amount: 240, status: 'paid', reference: 'GC-2026062303', timestamp: '2026-06-23 08:02' },
  { id: 'pay-004', ticketId: 'tkt-004', method: 'gcash', amount: 300, status: 'paid', reference: 'GC-2026062304', timestamp: '2026-06-23 09:03' },
  { id: 'pay-005', ticketId: 'tkt-005', method: 'cash', amount: 120, status: 'paid', timestamp: '2026-06-23 09:47' },
  { id: 'pay-006', ticketId: 'tkt-006', method: 'gcash', amount: 400, status: 'paid', reference: 'GC-2026062306', timestamp: '2026-06-23 07:02' },
  { id: 'pay-007', ticketId: 'tkt-007', method: 'gcash', amount: 240, status: 'paid', reference: 'GC-2026062307', timestamp: '2026-06-23 07:33' },
  { id: 'pay-008', ticketId: 'tkt-008', method: 'cash', amount: 80, status: 'paid', timestamp: '2026-06-23 08:12' },
  { id: 'pay-009', ticketId: 'tkt-009', method: 'gcash', amount: 240, status: 'paid', reference: 'GC-2026062309', timestamp: '2026-06-23 11:02' },
  { id: 'pay-010', ticketId: 'tkt-010', method: 'gcash', amount: 450, status: 'paid', reference: 'GC-2026062310', timestamp: '2026-06-23 06:31' },
  { id: 'pay-011', ticketId: 'tkt-fail-1', method: 'gcash', amount: 120, status: 'failed', reference: 'GC-2026062311', timestamp: '2026-06-23 10:15' },
  { id: 'pay-012', ticketId: 'tkt-pending-1', method: 'gcash', amount: 240, status: 'pending', reference: 'GC-2026062312', timestamp: '2026-06-23 11:30' },
];

export const ADMIN_KPI = {
  totalBuses: BUSES.length,
  ticketsIssued: TICKETS.length,
  revenue: PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
  occupancyRate: Math.round(
    (BUSES.reduce((s, b) => s + b.booked + b.boarded, 0) /
     BUSES.reduce((s, b) => s + b.capacity, 0)) * 100
  ),
};

export const BOOKING_TIMELINE = [
  { hour: '06:00', bookings: 4 },
  { hour: '07:00', bookings: 8 },
  { hour: '08:00', bookings: 12 },
  { hour: '09:00', bookings: 6 },
  { hour: '10:00', bookings: 3 },
  { hour: '11:00', bookings: 5 },
  { hour: '12:00', bookings: 2 },
];

export const PAYMENT_SPLIT = [
  { name: 'GCash', value: PAYMENTS.filter(p => p.method === 'gcash' && p.status === 'paid').length, color: '#007DFF' },
  { name: 'Cash', value: PAYMENTS.filter(p => p.method === 'cash' && p.status === 'paid').length, color: '#16A34A' },
];

export const DESTINATION_BREAKDOWN = [
  { name: 'Calamba', buses: BUSES.filter(b => b.destinationId === 'calamba').length },
  { name: 'Alabang', buses: BUSES.filter(b => b.destinationId === 'alabang').length },
  { name: 'Nuvali', buses: BUSES.filter(b => b.destinationId === 'nuvali').length },
  { name: 'Antipolo', buses: BUSES.filter(b => b.destinationId === 'antipolo').length },
  { name: 'Cavite', buses: BUSES.filter(b => b.destinationId === 'cavite').length },
];

export const SEED_LOG = [
  { timestamp: '2026-06-23 06:00', message: 'Seeded 20 buses across 5 destinations (120 departures total).' },
  { timestamp: '2026-06-22 23:00', message: 'Full data reset completed. All seats cleared.' },
  { timestamp: '2026-06-22 18:00', message: 'Seeded 16 buses for Calamba and Alabang routes.' },
];
