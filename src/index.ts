import { EachMessagePayload } from 'kafkajs';
import { consumer, connect } from './kafka/consumer.js';
import { handleMessage } from './handlers/message.handler.js';

const TOPICS = ['messages'] as const;

async function dispatch({ topic, partition, message }: EachMessagePayload): Promise<void> {
  const payload = message.value?.toString();
  if (!payload) return;

  console.log(`\n[${topic}] Partition ${partition} | Offset ${message.offset}`);

  try {
    await handleMessage(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${topic}] Unhandled error:`, msg);
  }
}

async function start(): Promise<void> {
  await connect([...TOPICS]);
  await consumer.run({ eachMessage: dispatch });
}

start().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
