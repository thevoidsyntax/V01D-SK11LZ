# PR Review Examples

This document contains worked examples of PR review comments.

## Example: Needs Updates Review

```markdown
### Needs Fixing

**1. Missing error handling**

The `processPayment` function does not handle network failures gracefully.

file:src/services/payment.ts:42

The function throws an unhandled exception when the payment gateway is unreachable, which will crash the user session.

Invariant: All external API calls must handle timeout and connection errors
Must survive:
- Network timeout during payment
- Payment gateway 5xx errors
- Connection refused

Plain simple English: The payment processing will crash if the payment service is temporarily unavailable.
```

## Example: LGTM Review

```markdown
LGTM

All findings resolved. Clean implementation with proper error handling and test coverage.

---
**LLM Attribution Footer**
Reviewed by Claude
```

---

*This is a placeholder. Expand with more examples covering different scenarios.*
