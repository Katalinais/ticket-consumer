// ─── Kafka messages ───────────────────────────────────────────────────────────

export interface ReserveMessage {
  action: 'reserve';
  userId: string;
  ticketId: string;
}

export interface PayMessage {
  action: 'pay';
  userId: string;
  ticketId: string;
  empresa_id: string;
  amount: number;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  network?: string;
}

export type StageMessage = ReserveMessage | PayMessage;

export interface ErrorMessage {
  text: string;
  language?: string;
  userId?: string;
}

// ─── Domain ───────────────────────────────────────────────────────────────────

export interface Reservation {
  userId: string;
  ticketId: string;
  reservedAt: Date;
  expiresAt: Date;
  timer: ReturnType<typeof setTimeout>;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface PaymentPayload {
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  empresa_id: string;
  idempotency_key: string;
  amount: number;
  network?: string;
}

export interface PaymentResult {
  ok: boolean;
  status: number;
  data: unknown;
}

// ─── WebSocket notifications ──────────────────────────────────────────────────

export type NotifyEvent =
  | { event: 'reserved';  userId: string; ticketId: string; expiresAt: string }
  | { event: 'taken';     userId: string; ticketId: string }
  | { event: 'paid';      userId: string; ticketId: string }
  | { event: 'rejected';  userId: string; ticketId: string; reason: string }
  | { event: 'expired';   userId: string; ticketId: string }
  | { event: 'error';     userId?: string; message: string };
