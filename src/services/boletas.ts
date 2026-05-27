import { Reservation } from '../types.js';
import { notificar } from '../websocket/notify.js';

const RESERVATION_TTL_MS = 3 * 60 * 1000; // 3 minutes

// In-memory state — replace with Redis in production
const reservations = new Map<string, Reservation>();

export function get(ticketId: string): Reservation | undefined {
  return reservations.get(ticketId);
}

export function release(ticketId: string): void {
  const reservation = reservations.get(ticketId);
  if (!reservation) return;

  clearTimeout(reservation.timer);
  reservations.delete(ticketId);
  console.log(`[tickets] ⏰ Ticket ${ticketId} released (userId: ${reservation.userId})`);
  notificar({ event: 'expired', userId: reservation.userId, ticketId });
}

export function reserve(userId: string, ticketId: string): Reservation {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MS);
  const timer = setTimeout(() => release(ticketId), RESERVATION_TTL_MS);

  const reservation: Reservation = { userId, ticketId, reservedAt: now, expiresAt, timer };
  reservations.set(ticketId, reservation);
  return reservation;
}

export function confirm(ticketId: string): boolean {
  const reservation = reservations.get(ticketId);
  if (!reservation) return false;

  clearTimeout(reservation.timer);
  reservations.delete(ticketId);
  return true;
}
