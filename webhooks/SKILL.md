---
name: webhooks
version: "1.0.0"
description: "Webhook implementation patterns, signature verification, and retry handling."
when_to_use: "When implementing webhooks, receiving third-party events, or building event-driven systems."
priority: medium
phase: any
category: [integration]
tech_stack:
  languages: [typescript, javascript, python, go]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - pattern: ["webhook", "signature", "verify", "event", "hook"]
      reason: "Webhook-related patterns detected"
capabilities:
  - signature-verification
  - retry-handling
  - event-processing
author: TheVoidSyntax
---

# WEBHOOKS v1.0 🪝

**Webhook implementation patterns, signature verification, and retry handling**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  WEBHOOK FLOW                                              │
├─────────────────────────────────────────────────────────────┤
│  1. Register webhook URL with provider                      │
│  2. Receive POST request                                  │
│  3. Verify signature                                     │
│  4. Process event                                        │
│  5. Return 200 OK                                       │
│  6. Handle retries if failed                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Signature Verification

### HMAC SHA-256 (Stripe-style)

```typescript
// lib/webhooks/signature.ts
import { createHmac, timingSafeEqual } from 'crypto';

export function verifySignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  tolerance = 300 // seconds
): boolean {
  const timestamp = parseInt(signature.split(',')[0]?.replace('t=', ''), 10);
  
  // Check timestamp
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) {
    return false; // Replay attack protection
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures
  const receivedSig = signature.split(',')[1]?.replace('v1=', '');
  
  return timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSig)
  );
}
```

### HMAC SHA-256 (GitHub-style)

```typescript
// lib/webhooks/signature.ts
import { createHmac, timingSafeEqual } from 'crypto';

export function verifyGitHubSignature(
  payload: string,
  signature: string, // 'sha256=xxx'
  secret: string
): boolean {
  const expectedSignature = 'sha256=' + createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## Express Webhook Handler

```typescript
// routes/webhooks.ts
import express from 'express';
import { verifySignature } from '@/lib/webhooks/signature';
import { processWebhookEvent } from '@/lib/webhooks/processor';

const router = express.Router();

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    // Verify signature
    const isValid = verifyStripeSignature(req.body, signature, secret);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse event
    const event = JSON.parse(req.body.toString());

    // Process asynchronously (don't block response)
    processWebhookEvent(event).catch(console.error);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook handler failed' });
  }
});

// GitHub webhook
router.post('/github', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const event = req.headers['x-github-event'] as string;

  try {
    if (!verifyGitHubSignature(req.body.toString(), signature, secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString());
    await processGitHubEvent(event, payload);

    res.json({ ok: true });
  } catch (error) {
    console.error('GitHub webhook error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});
```

---

## Event Processing

```typescript
// lib/webhooks/processor.ts
import { prisma } from '@/lib/prisma';
import { queue } from '@/lib/queue';

interface WebhookEvent {
  id: string;
  type: string;
  data: unknown;
}

export async function processWebhookEvent(event: WebhookEvent) {
  // Store event for idempotency
  const existing = await prisma.webhookEvent.findUnique({
    where: { eventId: event.id },
  });

  if (existing) {
    console.log('Duplicate event:', event.id);
    return; // Already processed
  }

  // Process based on event type
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    // Mark as processed
    await prisma.webhookEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        payload: event.data as object,
        processedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Event processing failed:', event.id, error);
    throw error; // Will trigger retry
  }
}
```

---

## Queue-Based Processing

```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const webhookQueue = new Queue('webhooks', { connection });

// Add job to queue
export async function enqueueWebhook(event: WebhookEvent) {
  await webhookQueue.add(event.type, event, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}

// Process jobs
const webhookWorker = new Worker(
  'webhooks',
  async (job) => {
    await processWebhookEvent(job.data);
  },
  { connection }
);

webhookWorker.on('failed', (job, error) => {
  console.error('Webhook job failed:', job?.data?.id, error);
});
```

---

## Retry Handling

### Express with Retry

```typescript
// routes/webhooks.ts
import express from 'express';

const router = express.Router();

router.post('/webhook', async (req, res) => {
  const eventId = req.headers['x-event-id'] as string;

  try {
    // Quick verification
    if (!verifyBasic(req.body)) {
      return res.status(400).send('Bad request');
    }

    // Process with retry logic
    await processWithRetry(req.body, {
      maxAttempts: 3,
      delay: 1000,
      backoff: 'exponential',
    });

    res.status(200).send('OK');
  } catch (error) {
    // Return 200 to prevent retries for permanent failures
    if (isPermanentFailure(error)) {
      console.error('Permanent webhook failure:', eventId);
      return res.status(200).send('OK');
    }

    // Return 500 to trigger provider retry
    res.status(500).send('Retry later');
  }
});
```

---

## Webhook Receiver (Client)

```typescript
// lib/webhooks/client.ts
export class WebhookClient {
  private secret: string;
  private url: string;

  constructor(secret: string, url: string) {
    this.secret = secret;
    this.url = url;
  }

  async send(event: WebhookEvent): Promise<void> {
    const payload = JSON.stringify(event);
    const signature = this.sign(payload);

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': Math.floor(Date.now() / 1000).toString(),
      },
      body: payload,
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status}`);
    }
  }

  private sign(payload: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac('sha256', this.secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    return `t=${timestamp},v1=${signature}`;
  }
}
```

---

## Best Practices

### 1. Always Return 200 Quickly

```typescript
// ✅ Good - process async
router.post('/webhook', async (req, res) => {
  res.status(200).json({ received: true });
  await processAsync(req.body); // Process in background
});

// ❌ Bad - blocking response
router.post('/webhook', async (req, res) => {
  await processSync(req.body); // Don't do this
  res.status(200).json({ received: true });
});
```

### 2. Handle Idempotency

```typescript
// ✅ Good - check for duplicates
const existing = await prisma.webhookEvent.findUnique({
  where: { eventId: event.id },
});
if (existing) return res.json({ ok: true });
```

### 3. Verify Before Processing

```typescript
// ✅ Good - verify signature first
router.post('/webhook', async (req, res) => {
  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Unauthorized');
  }
  // Process...
});
```

---

## Testing

```typescript
// __tests__/webhooks.test.ts
import { verifySignature } from '@/lib/webhooks/signature';
import { createHmac } from 'crypto';

describe('Webhook Signature Verification', () => {
  it('should verify valid signature', () => {
    const payload = JSON.stringify({ id: 'evt_123' });
    const secret = 'whsec_test';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = `t=${timestamp},v1=${createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex')}`;

    expect(verifySignature(payload, signature, secret)).toBe(true);
  });

  it('should reject invalid signature', () => {
    const payload = JSON.stringify({ id: 'evt_123' });
    const signature = 't=123,v1=invalid';

    expect(verifySignature(payload, signature, 'secret')).toBe(false);
  });
});
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/api-design` | API patterns |
| `/security` | Security best practices |
| `/testing` | Testing strategies |

---

*Build reliable event-driven systems!*
