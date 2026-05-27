import { IncomingMessage } from '../types.js';
import { humanize } from '../services/llm.js';
import { publish } from '../kafka/producer.js';

const OUTPUT_TOPIC = 'messages-out';

export async function handleMessage(payload: string): Promise<void> {
  let message: IncomingMessage;

  try {
    message = JSON.parse(payload) as IncomingMessage;
  } catch {
    console.error('[message] Invalid JSON payload');
    return;
  }

  const { type, text, language = 'español', userId } = message;

  if (!type || !text) {
    console.error('[message] Missing required fields "type" and/or "text"');
    return;
  }

  console.log(`[message] Processing ${type} message...`);
  const friendlyMessage = await humanize(text, type, language);
  console.log(`[message] "${friendlyMessage}"`);

  await publish(OUTPUT_TOPIC, { type, userId, message: friendlyMessage });
}
