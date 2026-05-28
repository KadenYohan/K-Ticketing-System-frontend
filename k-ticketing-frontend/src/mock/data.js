export let mockBuses = [
  { id: "b1", destination: "Manila", departureTime: "08:00", status: "scheduled", seatPrice: 500.00, seatsAvailable: 48, seatsReserved: 0, seatsBooked: 2 },
  { id: "b2", destination: "Baguio", departureTime: "10:00", status: "scheduled", seatPrice: 750.00, seatsAvailable: 50, seatsReserved: 0, seatsBooked: 0 },
  { id: "b3", destination: "Pampanga", departureTime: "12:00", status: "scheduled", seatPrice: 350.00, seatsAvailable: 45, seatsReserved: 0, seatsBooked: 5 }
];

export let mockSeats = {};
// Initialize seats 1-50 for all mock buses
["b1", "b2", "b3"].forEach(busId => {
  mockSeats[busId] = Array.from({ length: 50 }, (_, i) => ({
    seatId: i + 1,
    seatNumber: i + 1,
    status: (busId === "b1" && i < 2) || (busId === "b3" && i < 5) ? "booked" : "available",
    reservationExpiresAt: null
  }));
});

export let mockReservations = {};
export let mockPayments = {};
export let mockTickets = {};

// Helper reset to defaults
export const resetMockDatabase = () => {
  // Can be called to restore initial clean state during testing
};
