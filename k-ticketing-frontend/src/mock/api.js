import { mockBuses, mockSeats, mockReservations, mockPayments, mockTickets } from './data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const getDestinations = async () => {
  await delay();
  return ["Manila", "Baguio", "Pampanga"];
};

export const getBuses = async (date, destination) => {
  await delay();
  return mockBuses.filter(b => b.destination === destination);
};

export const getSeats = async (busId) => {
  await delay();
  if (!mockSeats[busId]) throw { status: 404, message: "Bus not found" };
  return mockSeats[busId];
};

export const reserveSeats = async (busId, seatIds) => {
  await delay();
  const seats = mockSeats[busId];
  const conflicting = seatIds.filter(id => seats[id - 1].status !== 'available');
  
  if (conflicting.length > 0) {
    const error = new Error("Seats not available");
    error.status = 409;
    error.data = { conflictingSeatIds: conflicting };
    throw error;
  }

  const reservationId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 Minutes
  
  mockReservations[reservationId] = { busId, seatIds, expiresAt };
  
  seatIds.forEach(id => {
    seats[id - 1].status = 'reserved';
    seats[id - 1].reservationExpiresAt = expiresAt;
  });

  return { reservationId, expiresAt };
};

export const cancelReservation = async (id) => {
  await delay();
  const res = mockReservations[id];
  if (res) {
    res.seatIds.forEach(sid => {
      if (mockSeats[res.busId][sid - 1].status === 'reserved') {
        mockSeats[res.busId][sid - 1].status = 'available';
        mockSeats[res.busId][sid - 1].reservationExpiresAt = null;
      }
    });
    delete mockReservations[id];
  }
  return { success: true };
};

export const initiatePayment = async (reservationId, amount) => {
  await delay();
  const paymentId = crypto.randomUUID();
  mockPayments[paymentId] = { reservationId, amount, status: 'pending' };
  
  // Simulate PayMongo Checkout Sandbox Target
  return {
    paymentId,
    qrImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='150' height='150' fill='black'/><text x='10' y='80' fill='white' font-size='12'>PAYMONGO GCASH</text></svg>",
    redirectUrl: "https://sandbox.paymongo.com/checkout/" + paymentId
  };
};

export const pollPaymentStatus = async (id) => {
  await delay(200);
  const payment = mockPayments[id];
  // Auto-resolve pending transactions to 'paid' on the third execution hook for fluent local simulation
  if (payment && payment.status === 'pending') {
    if (!payment.polls) payment.polls = 0;
    payment.polls++;
    if (payment.polls >= 3) payment.status = 'paid';
  }
  return { status: payment ? payment.status : 'failed' };
};

export const createTicket = async (reservationId, paymentMethod, paymentRef) => {
  await delay();
  const res = mockReservations[reservationId];
  if (!res) throw { status: 410, message: "Reservation expired" };
  
  const ticketId = crypto.randomUUID();
  const bus = mockBuses.find(b => b.id === res.busId);
  
  mockTickets[ticketId] = {
    ticketId,
    busId: res.busId,
    seats: res.seatIds,
    passengerCount: res.seatIds.length,
    totalAmount: res.seatIds.length * bus.seatPrice,
    paymentMethod,
    qrCode: ticketId,
    destination: bus.destination,
    departureTime: bus.departureTime,
    departureDate: new Date().toISOString().split('T')[0]
  };

  res.seatIds.forEach(sid => {
    mockSeats[res.busId][sid - 1].status = 'booked';
  });
  
  delete mockReservations[reservationId];
  return mockTickets[ticketId];
};

export const validateTicket = async (qrData, busId) => {
  await delay();
  const ticket = mockTickets[qrData];
  if (!ticket) return { valid: false, reason: "Ticket not found in ledger database", seats: [], remainingUnboarded: 0 };
  if (ticket.busId !== busId) return { valid: false, reason: "Ticket route variant mismatched for this bus context", seats: [], remainingUnboarded: 0 };
  if (ticket.used_at) return { valid: false, reason: "Ticket validation exhausted (Already Checked In)", seats: ticket.seats, remainingUnboarded: 0 };
  
  const unboardedCount = mockSeats[busId].filter(s => s.status === 'booked').length - ticket.seats.length;
  return { valid: true, reason: "", seats: ticket.seats, remainingUnboarded: Math.max(0, unboardedCount) };
};

export const checkInTicket = async (ticketId, busId) => {
  await delay();
  const ticket = mockTickets[ticketId];
  if (ticket) {
    ticket.used_at = new Date().toISOString();
    ticket.seats.forEach(sid => {
      mockSeats[busId][sid - 1].status = 'boarded';
    });
  }
  return { success: true, seats: ticket ? ticket.seats : [], alreadyBoarded: false };
};
