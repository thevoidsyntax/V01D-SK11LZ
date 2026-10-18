---
name: testing
description: "Testing strategy best practices including unit, integration, E2E, mutation, property-based, visual testing, and TDD methodology."
when_to_use: "Use when planning a test strategy or writing unit, integration, or E2E tests, or practicing TDD."
version: "2.0.0"
priority: high
phase: any
category: [ai-process]
tech_stack:
  languages: [typescript, javascript, python, go, java]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/tests/**"
      reason: "Test directory detected"
    - has_file: "**/*.test.ts"
      reason: "Test files detected"
    - has_file: "**/__tests__/**"
      reason: "Test directory detected"
  skill_tier: core
triggers:
  phrases:
    - "test"
    - "testing"
    - "unit test"
    - "integration test"
    - "e2e"
    - "end to end"
    - "vitest"
    - "jest"
    - "playwright"
    - "cypress"
    - "coverage"
    - "tdd"
    - "bdd"
    - "mutation"
capabilities: [implementation, analysis, review]
quality:
  rules_count: 25
  examples_count: 40
  stability: stable
integrates_with: [auto-router, diagnosing-bugs]
dependencies: [diagnosing-bugs]
source:
  origin: merged
  sources: ["ai-process/testing", "ai-process/tdd"]
author: thevoidsyntax
---

# TESTING MODULE

Kamu adalah Testing Specialist. Gunakan rules ini untuk setiap aspek testing strategy.

---

## 1. MUTATION TESTING
- **Purpose:**
  - Verify test quality
  - Detect blind spots
  - Measure test effectiveness
- **Tools:**
  - Pitest (Java)
  - Mutmut (Python)
  - Stryker (.NET, JS)
- **Workflow:**
  - Run mutation tests
  - Fix killed mutants
  - Maintain high score
- **Thresholds:**
  - Minimum kill rate: 80%
  - Critical code: 90%+

## 2. PROPERTY-BASED TESTING
- **Purpose:**
  - Test many inputs
  - Find edge cases
  - Verify properties
- **Tools:**
  - Hypothesis (Python)
  - fast-check (JS/TS)
  - jqwik (Java)
- **Strategies:**
  - Generate random data
  - Shrink failing cases
  - Define invariants
- **Use Cases:**
  - Serialization
  - Algorithm correctness
  - API contracts

## 3. VISUAL REGRESSION TESTING
- **Purpose:**
  - Detect UI changes
  - Prevent visual bugs
  - Document styles
- **Tools:**
  - Percy, Chromatic
  - BackstopJS
  - Playwright screenshot
- **Workflow:**
  - Baseline screenshots
  - Compare on changes
  - Approve/reject
- **Best Practices:**
  - Test critical pages
  - Responsive testing
  - Dark mode testing

## 4. SMOKE & SANITY TESTING
- **Smoke Tests:**
  - Critical path coverage
  - Quick execution
  - Fail-fast approach
- **Sanity Tests:**
  - Verify specific fix
  - Narrow scope
  - Before regression suite
- **Implementation:**
  - Fast feedback
  - Automated execution
  - Clear pass/fail
- **Use Cases:**
  - Pre-deployment
  - Post-deployment
  - CI/CD pipeline

## 5. CONTRACT TESTING
- **Consumer-Driven Contracts:**
  - Pact, Pact Broker
  - Consumer defines expectations
  - Provider verifies
- **API Contract Testing:**
  - OpenAPI validation
  - Request/response matching
  - Schema compatibility
- **Workflow:**
  - Consumer writes tests
  - Publish to broker
  - Provider verifies
- **Benefits:**
  - Fast feedback
  - Independent teams
  - API evolution

## 6. CHAOS ENGINEERING
- **Purpose:**
  - Test resilience
  - Find weaknesses
  - Improve reliability
- **Tools:**
  - Chaos Monkey
  - Gremlin
  - Litmus (K8s)
- **Experiments:**
  - Kill random instances
  - Introduce latency
  - Fill disk space
- **Best Practices:**
  - Start small
  - Have rollback
  - Monitor impact
  - Learn from results

## 7. END-TO-END TESTING
- **Scope:**
  - Critical user flows
  - Cross-browser testing
  - Mobile testing
- **Tools:**
  - Playwright, Cypress
  - Selenium
  - Puppeteer
- **Best Practices:**
  - Stable selectors
  - Isolated tests
  - Parallel execution
  - Retry logic
- **Maintenance:**
  - Flaky test handling
  - Regular updates
  - Page object pattern

## 8. INTEGRATION TESTING
- **Scope:**
  - Service integration
  - Database integration
  - External API integration
- **Strategies:**
  - Test containers
  - Contract testing
  - Shared database
- **Tools:**
  - Testcontainers
  - Docker Compose
  - WireMock
- **Best Practices:**
  - Isolated tests
  - Data cleanup
  - Deterministic results

## 9. PERFORMANCE TESTING
- **Types:**
  - Load testing
  - Stress testing
  - Endurance testing
- **Metrics:**
  - Response time
  - Throughput
  - Resource usage
- **Tools:**
  - k6, JMeter, Gatling
  - Locust
  - Apache Bench
- **SLA Validation:**
  - Define targets
  - Test against SLA
  - Report violations

## 10. SECURITY TESTING
- **SAST:**
  - Static analysis
  - Code scanning
  - IDE integration
- **DAST:**
  - Dynamic scanning
  - OWASP ZAP
  - Automated crawling
- **SCA:**
  - Dependency scanning
  - License compliance
  - Vulnerability database
- **Penetration Testing:**
  - Manual testing
  - Automated tools
  - Regular schedule

## 11. TEST DATA MANAGEMENT
- **Test Data Strategy:**
  - Synthetic data
  - Masked production data
  - On-demand generation
- **Data Fixtures:**
  - Factories
  - Builders
  - Generators
- **Data Cleanup:**
  - Transaction rollback
  - Cleanup scripts
  - Database reset
- **Privacy:**
  - PII anonymization
  - GDPR compliance
  - Secure storage

## 12. TEST PYRAMID
- **Structure:**
  - Many unit tests
  - Fewer integration tests
  - Few E2E tests
- **Balance:**
  - Fast feedback
  - Confidence level
  - Maintenance cost
- **Anti-patterns:**
  - Inverted pyramid
  - Over-reliance on E2E
  - Brittle tests
- **CI Integration:**
  - Run tests in parallel
  - Prioritize fast tests
  - Gradual rollout

---

## Test Master Workflow

### Core Workflow
1. **Define scope** — Identify what to test and which testing types apply
2. **Create strategy** — Plan the test approach
3. **Write tests** — Implement tests with proper assertions
4. **Execute** — Run tests and collect results
5. **Report** — Document findings with severity ratings

### Jest Unit Test Example
```js
describe('calculateDiscount', () => {
  it('applies 10% discount for premium users', () => {
    const result = calculateDiscount({ price: 100, userTier: 'premium' });
    expect(result).toBe(90);
  });

  it('throws on negative price', () => {
    expect(() => calculateDiscount({ price: -1, userTier: 'standard' }))
      .toThrow('Price must be non-negative');
  });
});
```

---

## Constraints

### MUST DO
- Test happy paths AND error/edge cases
- Mock external dependencies
- Use meaningful `it('...')` descriptions
- Assert specific outcomes
- Run tests in CI/CD
- Test critical pages with visual regression

### MUST NOT DO
- Skip error-path testing
- Use production data in tests
- Create order-dependent tests
- Ignore flaky tests

---

## 13. TEST-DRIVEN DEVELOPMENT (TDD)

TDD is the **red → green loop**. This methodology produces tests worth keeping: what a good test is, where tests go, anti-patterns, and the rules of the loop.

### The Red-Green-Refactor Cycle

```
┌─────────┐    Write failing    ┌─────────┐    Minimal code     ┌─────────┐
│   RED   │ ─────────────────► │  GREEN  │ ─────────────────► │ REFACTOR│
│  Phase  │       test         │  Phase  │       to pass      │  Phase  │
└─────────┘                    └─────────┘                    └─────────┘
     ▲                                                        │
     └──────────────────── Loop back ◄────────────────────────┘
```

#### Phase RED - Write Test First
1. Write unit test that defines expected behavior
2. Test MUST FAIL before implementation exists
3. Do NOT write implementation before test

#### Phase GREEN - Minimal Implementation
1. Write code as minimal as possible
2. Only enough to make test PASS
3. Do NOT optimize - focus on correctness

#### Phase REFACTOR - Improve Code
1. Refactor for cleanliness & performance
2. Remove duplications
3. Ensure tests still PASS after refactor

### What a Good Test Is

Tests verify behavior through **public interfaces**, not implementation details. Code can change entirely; tests shouldn't.

| Good Test | Bad Test |
|-----------|----------|
| Tests observable behavior | Tests implementation details |
| Survives refactors | Breaks on refactor |
| Public API only | Mocks internal collaborators |
| Independent expected values | Tautological assertions |

### Good Test Example
```typescript
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

### Bad Test Example (Implementation Detail)
```typescript
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

### Seams: Where Tests Go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside.

**Test only at pre-agreed seams.** Before writing any test, confirm the seams with the user. No test is written at an unconfirmed seam.

---

**Invoke:** `/testing` | **Priority:** HIGH | **Version:** 2.0.0
