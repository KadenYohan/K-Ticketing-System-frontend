// Real API module — thin fetch wrapper matching the k-ticketing backend spec.
import { CONFIG } from './config';

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

const base = () => CONFIG.API_BASE_URL;

export const getDestinations = () =>
  fetch(`${base()}/destinations`).then(handleResponse);

export const getBuses = (date, dest) =>
  fetch(`${base()}/buses?date=${date}&destination=${dest}`).then(handleResponse);

export const getSeats = (busId) =>
  fetch(`${base()}/buses/${busId}/seats`).then(handleResponse);

export const reserveSeats = (busId, seatIds) =>
  fetch(`${base()}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ busId, seatIds }),
  }).then(handleResponse);

export const cancelReservation = (id) =>
  fetch(`${base()}/reservations/${id}`, { method: 'DELETE' }).then(handleResponse);

export const initiatePayment = (reservationId, amount) =>
  fetch(`${base()}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservationId, amount }),
  }).then(handleResponse);

export const pollPaymentStatus = (id) =>
  fetch(`${base()}/payments/${id}/status`).then(handleResponse);

export const createTicket = (reservationId, paymentMethod, paymentRef) =>
  fetch(`${base()}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservationId, paymentMethod, paymentRef }),
  }).then(handleResponse);

export const validateTicket = (qrData, busId) =>
  fetch(`${base()}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrData, busId }),
  }).then(handleResponse);

export const checkInTicket = (ticketId, busId) =>
  fetch(`${base()}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId, busId }),
  }).then(handleResponse);
