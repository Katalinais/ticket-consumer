import { Kafka, Producer, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'consumer-app-producer',
  brokers: ['localhost:9092'],
});

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();
    console.log('[Kafka Producer] Connected');
  }
  return producer;
}

export async function publish(topic: string, message: object): Promise<void> {
  const p = await getProducer();
  await p.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}
