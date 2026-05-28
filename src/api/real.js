import { CONFIG } from '../config';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API Error');
    error.status = res.status;
    error.data = errorData;
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const getDestinations = () => fetch(`${CONFIG.API_BASE_URL}/destinations`).then(handleResponse);
export const getBuses = (date, dest) => fetch(`${CONFIG.API_BASE_URL}/buses?date=${date}&destination=${dest}`).then(handleResponse);
export const getSeats = (busId) => fetch(`${CONFIG.API_BASE_URL}/buses/${busId}/seats`).then(handleResponse);
export const reserveSeats = (busId, seatIds) => fetch(`${CONFIG.API_BASE_URL}/reservations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ busId, seatIds })
}).then(handleResponse);
export const cancelReservation = (id) => fetch(`${CONFIG.API_BASE_URL}/reservations/${id}`, { method: 'DELETE' }).then(handleResponse);
export const initiatePayment = (reservationId, amount) => fetch(`${CONFIG.API_BASE_URL}/payments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reservationId, amount })
}).then(handleResponse);
export const pollPaymentStatus = (id) => fetch(`${CONFIG.API_BASE_URL}/payments/${id}/status`).then(handleResponse);
export const createTicket = (reservationId, paymentMethod, paymentRef) => fetch(`${CONFIG.API_BASE_URL}/tickets`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reservationId, paymentMethod, paymentRef })
}).then(handleResponse);
export const validateTicket = (qrData, busId) => fetch(`${CONFIG.API_BASE_URL}/validate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ qrData, busId })
}).then(handleResponse);
export const checkInTicket = (ticketId, busId) => fetch(`${CONFIG.API_BASE_URL}/checkin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ticketId, busId })
}).then(handleResponse);