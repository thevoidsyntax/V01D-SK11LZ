---
name: payment-stripe
version: "1.0.0"
description: "Stripe payment integration patterns, checkout, subscriptions, and webhooks."
when_to_use: "When implementing Stripe payments, subscriptions, checkout, or handling payment webhooks."
priority: medium
phase: production
category: [integration]
tech_stack:
  services: [stripe]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - pattern: ["stripe", "@stripe/stripe-js", "PaymentElement", "checkout"]
      reason: "Stripe usage detected"
capabilities:
  - checkout
  - subscriptions
  - webhooks
author: TheVoidSyntax
---

# STRIPE PAYMENTS v1.0 💳

**Stripe payment integration patterns, checkout, subscriptions, and webhooks**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  STRIPE CLI                                                 │
├─────────────────────────────────────────────────────────────┤
│  stripe login                → Authenticate CLI               │
│  stripe listen              → Listen for webhooks locally   │
│  stripe trigger             → Trigger test events           │
│  stripe api resources list → List available APIs           │
└─────────────────────────────────────────────────────────────┘
```

---

## Client Setup

### Stripe.js

```typescript
// lib/stripe/client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
```

### Server Client

```typescript
// lib/stripe/server.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
```

---

## Checkout Sessions

### Create Checkout Session

```typescript
// lib/stripe/checkout.ts
import { stripe } from './server';
import { createClient } from '@/lib/supabase/server';

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();

  // Get user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    metadata: {
      userId: user.id,
    },
    // Enable billing address collection
    billing_address_collection: 'required',
    // Enable coupon support
    allow_promotion_codes: true,
  });

  return session;
}
```

### One-time Payment

```typescript
// Create one-time payment
export async function createOneTimePayment(
  amount: number,
  productName: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
          },
          unit_amount: amount, // in cents
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    metadata: {
      userId,
    },
  });

  return session;
}
```

---

## Customer Portal

```typescript
// lib/stripe/portal.ts
import { stripe } from './server';

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
```

### Usage in Component

```typescript
// app/settings/page.tsx
'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleManageBilling} disabled={loading}>
      {loading ? 'Loading...' : 'Manage Billing'}
    </button>
  );
}
```

---

## Subscriptions

### Create Subscription

```typescript
// lib/stripe/subscriptions.ts
import { stripe } from './server';

export async function createSubscription(
  customerId: string,
  priceId: string,
  userId: string
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId,
    },
  });

  return subscription;
}
```

### Manage Subscription

```typescript
// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

// Pause subscription
export async function pauseSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    pause_collection: {
      behavior: 'mark_uncollectible',
    },
  });
}
```

---

## Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Webhook Error', { status: 400 });
  }

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Webhook handler error', { status: 500 });
  }

  return new Response(null, { status: 200 });
}
```

### Event Handlers

```typescript
// Handlers for Stripe events
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
    },
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  await prisma.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'canceled' },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Notify user about payment failure
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (user) {
    // Send email notification
    await sendPaymentFailedEmail(user.email);
  }
}
```

---

## Products & Prices

### Create Product

```typescript
// lib/stripe/products.ts
import { stripe } from './server';

export async function createProduct(
  name: string,
  priceInCents: number,
  interval: 'month' | 'year'
) {
  // Create product
  const product = await stripe.products.create({
    name,
    metadata: {
      type: 'subscription',
    },
  });

  // Create price
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: priceInCents,
    currency: 'usd',
    recurring: {
      interval,
    },
  });

  return { product, price };
}
```

---

## Local Development

### Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get webhook signing secret
stripe listen --print-secret

# Trigger test events
stripe trigger checkout.session.completed
```

### Environment Variables

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Best Practices

### 1. Always Use Webhooks for Status

```typescript
// ❌ Bad - don't check status on client
const subscription = await stripe.subscriptions.retrieve(id);
if (subscription.status === 'active') { /* ... */ }

// ✅ Good - use webhooks to update DB
// Webhook sets subscription status in DB
const user = await prisma.user.findUnique({ where: { id: userId }});
if (user.subscriptionStatus === 'active') { /* ... */ }
```

### 2. Store Minimal Customer Data

```typescript
// ✅ Good - only store IDs
await prisma.user.update({
  where: { id: userId },
  data: {
    stripeCustomerId: customer.id,
  },
});

// ❌ Bad - don't duplicate Stripe data
await prisma.user.update({
  where: { id: userId },
  data: {
    stripeCustomerId: customer.id,
    customerEmail: customer.email, // Redundant!
    customerName: customer.name, // Redundant!
  },
});
```

### 3. Handle All Webhook Events

```typescript
// ✅ Good - always handle the event
switch (event.type) {
  case 'checkout.session.completed':
    await handleCheckoutCompleted(event.data.object);
    break;
  // ...
  default:
    console.log(`Unhandled: ${event.type}`); // Log but don't fail
}
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/webhooks` | General webhook patterns |
| `/auth-flows` | Authentication |
| `/database` | Database design |

---

*Accept payments, grow revenue!*
