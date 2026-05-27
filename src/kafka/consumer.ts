import { Kafka, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'consumer-app',
  brokers: ['localhost:9092'],
});

export const consumer: Consumer = kafka.consumer({ groupId: 'consumer-group' });

export async function connect(topics: string[]): Promise<void> {
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }
  console.log(`[Kafka] Connected. Listening on topics: ${topics.join(', ')}`);
}
