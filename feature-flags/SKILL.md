---
name: feature-flags
description: "Progressive delivery with feature flags, canary deployments, A/B testing, and gradual rollouts"
when_to_use: "Use when rolling out progressively: feature flags, canary, A/B tests, or gradual rollout."
version: "1.0.0"
category: [infrastructure]
priority: medium
phase: phase-4
tech_stack:
  languages: [all]
  services: [launchdarkly, unleash, statsig]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["feature flag", "canary", "ab test", "progressive delivery"]
      reason: "Progressive delivery detected"
  skill_tier: optional
triggers:
  phrases:
    - "feature flag"
    - "canary deployment"
    - "ab testing"
    - "progressive delivery"
    - "gradual rollout"
    - "toggle"
capabilities: [implementation, analysis]
quality:
  rules_count: 12
  examples_count: 15
  stability: stable
integrates_with: [deployment, ci-cd, observability]
dependencies: [deployment, observability]
source:
  origin: local
author: thevoidsyntax
---

# Feature Flags - Progressive Delivery

Progressive delivery patterns with feature flags, canary deployments, A/B testing, and gradual rollouts for safe software delivery.

## Core Workflow

1. **Define Flags** — Identify what to gate
2. **Implement** — Add flag evaluation to code
3. **Configure** — Set targeting rules
4. **Monitor** — Track metrics and rollback
5. **Clean Up** — Remove flags after full rollout

## Feature Flag Types

| Type | Use Case | Example |
|------|----------|---------|
| **Release** | Separate deploy from release | Dark launch, testing in prod |
| **Experiment** | A/B testing | New checkout flow |
| **Ops** | Kill switches | Disable expensive features |
| **Permission** | User segments | Premium features |

## Implementation

### Basic Flag Pattern
```typescript
import { useFlag } from '@/lib/flags';

function CheckoutButton() {
  const isEnabled = useFlag('new-checkout-flow');
  
  return isEnabled ? (
    <NewCheckoutButton />
  ) : (
    <LegacyCheckoutButton />
  );
}
```

## A/B Testing

```typescript
const flags = await client.allFlagsState({
  key: userId,
  email: user.email,
});

const variant = flags.getFlagValue('checkout-experiment', 'control');
```

## Kill Switches

```typescript
async function processPayment(order: Order) {
  const isEnabled = await flagClient.isEnabled('payment-processing');
  
  if (!isEnabled) {
    return { status: 'disabled', message: 'Temporarily unavailable' };
  }
  
  return await paymentGateway.charge(order);
}
```

## Essential Practices

### MUST DO
- Use descriptive flag names
- Implement fallback behavior when flags are unavailable
- Monitor metrics before, during, and after rollout
- Set up alerts for flag changes in production
- Clean up flags after full rollout

### MUST NOT DO
- Hardcode flag values
- Create too many flags
- Leave debug flags in production
- Rollout without gradual percentage

---

**Invoke:** `/feature-flags` | **Version:** 1.0.0
