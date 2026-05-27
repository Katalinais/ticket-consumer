import { PaymentPayload, PaymentResult } from '../types.js';

const GATEWAY_URL = process.env.PASARELA_URL ?? 'http://localhost:4000';

export async function processPayment(payload: PaymentPayload): Promise<PaymentResult> {
  const response = await fetch(`${GATEWAY_URL}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  return { ok: response.ok, status: response.status, data };
}
