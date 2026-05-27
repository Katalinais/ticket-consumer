// ─── Kafka messages ───────────────────────────────────────────────────────────

export interface IncomingMessage {
  type: 'error' | 'success';
  text: string;
  language?: string;
  userId?: string;
}

export interface OutgoingMessage {
  type: 'error' | 'success';
  userId?: string;
  message: string;
}

