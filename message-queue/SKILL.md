---
name: message-queue
description: Message queue patterns, event-driven architecture, Kafka, RabbitMQ, and SQS best practices
version: "1.0.0"
category: [backend, data]
priority: medium
phase: phase-3
tech_stack:
  services: [kafka, rabbitmq, sqs, redis]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/queue/**"
      reason: "Queue code detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 12
  examples_count: 20
  stability: stable
integrates_with: [api-design, scalability]
source:
  origin: local
author: Claude
---

# Message Queue - Event-Driven Architecture

## Patterns Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  MESSAGE QUEUE PATTERNS                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Point-to-Point          │  Pub/Sub                            │
│  ┌─────┐    ┌─────┐    │  ┌─────┐    ┌─────┐ ┌─────┐       │
│  │ P1  │───►│ Q   │───►│W1 │  │ P1  │───►│Topic│───►│S1│S2│S3│
│  │ P2  │───►│     │───►│W2 │  │ P2  │───►│     │───►│   │   │   │
│  └─────┘    └─────┘    │    │  └─────┘    └─────┘ └───┘ └───┘ │
│                                                                  │
│  Work Queue             │  RPC / Request-Reply                   │
│  ┌─────┐    ┌─────┐    │    │  ┌─────┐    ┌─────┐    ┌─────┐  │
│  │     │───►│ Q   │───►│W1 │    │Client│───►│Queue│───►│Reply│  │
│  │Task │───►│     │───►│W2 │    │      │◄───│     │◄───│Queue│  │
│  │Batch│───►│     │───►│W3 │    └─────┘    └─────┘    └─────┘  │
│  └─────┘    └─────┘    │    │                                     │
│                         │    │                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Kafka (Event Streaming)

### Producer Configuration
```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-1:9092', 'kafka-2:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});

await producer.connect();

// Send single message
await producer.send({
  topic: 'user-events',
  messages: [
    {
      key: 'user-123',
      value: JSON.stringify({
        type: 'USER_CREATED',
        userId: 'user-123',
        email: 'john@example.com',
        timestamp: new Date().toISOString(),
      }),
      headers: {
        'correlation-id': 'req-456',
      },
    },
  ],
});

// Send batch
await producer.send({
  topic: 'orders',
  messages: orders.map(order => ({
    key: order.id,
    value: JSON.stringify(order),
    partition: order.userId.hashCode() % 3,
  })),
});

await producer.disconnect();
```

### Consumer Configuration
```typescript
const consumer = kafka.consumer({
  groupId: 'order-service',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

await consumer.connect();
await consumer.subscribe({ topic: 'orders', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const order = JSON.parse(message.value!.toString());

    logger.info('Processing message', {
      topic,
      partition,
      offset: message.offset,
      key: message.key?.toString(),
      order
    });

    // Process order
    await processOrder(order);

    // Commit offset (auto-commit disabled)
    // Commits after successful processing
  },
});
```

### Exactly-Once Processing
```typescript
const admin = kafka.admin();
await admin.connect();

// Create transaction
const transaction = await admin.createTransaction();

try {
  // Send to main topic
  await transaction.send({
    topic: 'order-events',
    messages: [{
      key: order.id,
      value: JSON.stringify(order),
    }],
  });

  // Send to dead letter topic
  await transaction.send({
    topic: 'order-events-dlq',
    messages: [{
      key: order.id,
      value: JSON.stringify({ ...order, dlqReason: 'validation_error' }),
    }],
  });

  await transaction.commit();
} catch (error) {
  await transaction.abort();
  throw error;
}
```

## RabbitMQ

### Connection & Channel
```typescript
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
const channel = await connection.createChannel();

// Set prefetch for fair dispatch
await channel.prefetch(1);

// Declare exchange
await channel.assertExchange('orders', 'topic', { durable: true });

// Declare queue
await channel.assertQueue('order-processing', {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': 'orders-dlx',
    'x-dead-letter-routing-key': 'order.failed',
    'x-message-ttl': 86400000, // 24 hours
  },
});

// Bind queue to exchange
await channel.bindQueue('order-processing', 'orders', 'order.*');
```

### Publisher
```typescript
// Publish with confirmation
await channel.waitForConfirms();

const success = channel.publish(
  'orders',
  'order.created',
  Buffer.from(JSON.stringify(order)),
  {
    persistent: true,
    contentType: 'application/json',
    headers: {
      'x-correlation-id': correlationId,
      'x-retry-count': 0,
    },
    messageId: generateUUID(),
    timestamp: Date.now(),
  }
);

if (!success) {
  throw new Error('Message not confirmed by broker');
}
```

### Consumer
```typescript
await channel.consume('order-processing', async (msg) => {
  if (!msg) return;

  const order = JSON.parse(msg.content.toString());
  const retryCount = (msg.properties.headers?.['x-retry-count'] as number) || 0;

  try {
    await processOrder(order);
    channel.ack(msg);

  } catch (error) {
    if (retryCount < 3) {
      // Requeue with retry count
      channel.publish(
        'orders',
        'order.created',
        msg.content,
        {
          ...msg.properties,
          headers: {
            ...msg.properties.headers,
            'x-retry-count': retryCount + 1,
            'x-last-retry': new Date().toISOString(),
          },
        }
      );
      channel.ack(msg);
    } else {
      // Send to DLQ
      channel.publish('orders-dlx', 'order.failed', msg.content, {
        headers: {
          ...msg.properties.headers,
          'x-failure-reason': (error as Error).message,
        },
      });
      channel.ack(msg);
    }
  }
}, { noAck: false });
```

## AWS SQS

### Standard Queue
```typescript
import { SQSClient, SendMessageCommand, ReceiveMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'us-east-1' });
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789/my-queue';

// Send message
await sqs.send(new SendMessageCommand({
  QueueUrl: queueUrl,
  MessageBody: JSON.stringify({ type: 'ORDER_CREATED', order }),
  MessageAttributes: {
    MessageType: {
      DataType: 'String',
      StringValue: 'OrderCreated',
    },
  },
  DelaySeconds: 0,
  MessageDeduplicationId: `order-${order.id}`,
  MessageGroupId: 'orders', // Required for FIFO
}));

// Receive messages
const { Messages } = await sqs.send(new ReceiveMessageCommand({
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  WaitTimeSeconds: 20,
  VisibilityTimeout: 30,
}));

for (const message of Messages || []) {
  const body = JSON.parse(message.Body!);

  try {
    await processMessage(body);
    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle!,
    }));
  } catch (error) {
    // Message will become visible again after VisibilityTimeout
    throw error;
  }
}
```

### Dead Letter Queue
```typescript
// Create DLQ
await sqs.send(new CreateQueueCommand({
  QueueName: 'my-queue-dlq',
  Attributes: {
    MessageRetentionPeriod: '1209600', // 14 days
  },
}));

// Configure redrive policy
await sqs.send(new SetQueueAttributesCommand({
  QueueUrl: queueUrl,
  Attributes: {
    RedrivePolicy: JSON.stringify({
      deadLetterTargetArn: dlqArn,
      maxReceiveCount: '5', // Move to DLQ after 5 failed receives
    }),
  },
}));
```

## Event Patterns

### Event Schema
```typescript
interface DomainEvent<T = unknown> {
  eventId: string;       // UUID
  eventType: string;     // 'OrderCreated'
  aggregateId: string;   // Order ID
  aggregateType: string; // 'Order'
  version: number;       // Event version for ordering
  timestamp: string;     // ISO 8601
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, unknown>;
  data: T;
}

// Example
const event: DomainEvent<OrderData> = {
  eventId: 'evt-123',
  eventType: 'OrderCreated',
  aggregateId: 'ord-456',
  aggregateType: 'Order',
  version: 1,
  timestamp: new Date().toISOString(),
  correlationId: 'req-789',
  data: {
    orderId: 'ord-456',
    customerId: 'cust-123',
    items: [...],
    total: 99.99,
  },
};
```

### Outbox Pattern
```typescript
// In same transaction as business logic
await db.transaction(async (trx) => {
  // 1. Update order status
  await trx('orders')
    .where({ id: orderId })
    .update({ status: 'confirmed', updatedAt: new Date() });

  // 2. Write to outbox
  await trx('outbox').insert({
    aggregateType: 'Order',
    aggregateId: orderId,
    eventType: 'OrderConfirmed',
    payload: JSON.stringify(orderConfirmedEvent),
    createdAt: new Date(),
  });
});

// Separate process reads outbox and publishes
async function processOutbox() {
  const pending = await db('outbox')
    .where('processedAt', null)
    .orderBy('createdAt')
    .limit(100);

  for (const event of pending) {
    try {
      await kafka.publish(event.eventType, event.payload);

      await db('outbox')
        .where({ id: event.id })
        .update({ processedAt: new Date() });
    } catch (error) {
      // Will retry on next poll
    }
  }
}
```

## Idempotency

### Consumer Idempotency
```typescript
const processedMessages = new Set<string>();

async function processMessage(msg: Message) {
  const messageId = msg.MessageId;

  // Skip if already processed
  if (processedMessages.has(messageId)) {
    return;
  }

  // Check database
  const existing = await db('processed_events')
    .where({ messageId })
    .first();

  if (existing) {
    return;
  }

  // Process
  await doProcessing(msg);

  // Mark as processed
  await db('processed_events').insert({
    messageId,
    processedAt: new Date(),
  });

  processedMessages.add(messageId);
}
```

### Producer Idempotency
```typescript
// Use message ID as idempotency key
const idempotencyKey = `create-order-${order.id}-${Date.now()}`;

await sqs.send(new SendMessageCommand({
  QueueUrl: queueUrl,
  MessageBody: JSON.stringify(order),
  MessageDeduplicationId: idempotencyKey,
}));

// Or in Kafka
await producer.send({
  topic: 'orders',
  messages: [{
    key: order.id,
    value: JSON.stringify(order),
    idempotent: true,
  }],
});
```

## Error Handling

### Circuit Breaker for Queue
```typescript
class QueueCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

---

**Invoke:** `/message-queue` | **Priority:** LOW
