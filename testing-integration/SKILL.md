---
name: testing-integration
description: "Integration testing patterns with API mocks, service workers, and e2e testing."
when_to_use: "Use when writing integration tests with API mocks or service workers."
version: "1.0.0"
category: [testing]
priority: low
phase: any
tech_stack:
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["integration test", "e2e", "msw"]
  skill_tier: optional
triggers:
  phrases:
    - "integration test"
    - "e2e"
    - "playwright"
    - "cypress"
    - "msw"
capabilities: [testing]
dependencies: [testing]
integrates_with: [testing, react-pro]
---

# TESTING-INTEGRATION v1.0

Integration testing patterns with mocking, service workers, and e2e testing.

## Mock Service Worker (MSW)

### 1. Setup

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json({ data: users });
  }),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    const user = { id: crypto.randomUUID(), ...body };
    users.push(user);
    return HttpResponse.json(user, { status: 201 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Error Mocking

```typescript
server.use(
  http.get('/api/users', () => {
    return HttpResponse.json({ code: 'NETWORK_ERROR' }, { status: 500 });
  }),
);
```

## Playwright

### 1. Config

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  baseURL: 'http://localhost:3000',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: Boolean(process.env.CI),
  },
});
```

### 2. Test File

```typescript
import { test, expect } from '@playwright/test';

test('user login flow', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');

  await page.click('[type=submit]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid=user-email]')).toHaveText('user@example.com');
});
```

### 3. Test Isolation

```typescript
test('create user', async ({ page, request }) => {
  // API call for setup
  const user = await request.post('/api/users', {
    data: { email: 'new@example.com' },
  });
  const { id } = await user.json();

  // Visit page with seeded data
  await page.goto(`/users/${id}`);

  await expect(page.locator('text=User Details')).toBeVisible();
});
```

## Best Practices

```
API MOCKING:
  [x] MSW for REST mocking
  [x] Realistic delays in mocks
  [x] Error responses tested

E2E TESTING:
  [x] Authenticated state via storage
  [x] Visual testing for critical flows
  [x] CI on every PR
  [x] Test isolation with seeded data

COVERAGE:
  [x] Happy paths, error paths, edge cases
  [x] Critical user flows only (not every button)
```

---

*Author: TheVoidSyntax*
